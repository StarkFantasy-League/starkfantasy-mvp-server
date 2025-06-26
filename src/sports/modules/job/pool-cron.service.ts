import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { SportmonksService } from '../API/sportmonks.service';
import { CricketPoolService } from '../pools/service/pool.service';
import { CricketMatchService } from '../match/service/match.service';
import { CricketPool, CricketMatch, CricketPoolStatus } from 'src/schema';

@Injectable()
export class TaskPoolService implements OnModuleInit {
    private readonly logger = new Logger(TaskPoolService.name);

    constructor(
        private readonly sportmonksService: SportmonksService,
        private readonly cricketPoolService: CricketPoolService,
        private readonly cricketMatchService: CricketMatchService,
    ) { }

    async onModuleInit() {

        // trigger the pool creation
        // this.logger.log('Triggering pool creation on startup for testing...');
        // await this.createPoolsForMatches();

        this.logger.log('Triggering pool results update on startup for testing...');
        await this.updatePoolResults();
    }

    
    /**
     * This cron job runs every day at midnight to update the pool results
     * based on the finished matches from Sportmonks.
     */
    @Cron('0 0 * * *') // Runs every day at midnight
    async updatePoolResults() {
        this.logger.log('Starting pool results update...');

        // Get active pools
        const pools = await this.cricketPoolService.findAll();
        if (!pools || pools.length === 0) {
            this.logger.warn('No pools found.');
            return;
        }

        const pastPools: CricketPool[] = pools.filter(pool => 
            pool.match.matchDate < new Date()
        );
        // console.log(pastPools);

        const sportmonksMatches = await this.sportmonksService.getSeasonMatches(true);
        const filteredMatches = sportmonksMatches.filter(match => 
            match.status.toLowerCase() === CricketPoolStatus.Finished
        );
        

        for (const pool of pastPools) {
            this.logger.log(`Processing pool: ${pool.id}`);

            // get the matches for each pool
            const match = filteredMatches.find(m => m.id == pool.cricketMatchId);
            if (!match) {
                this.logger.warn(`Match not found for pool: ${pool.id}`);
                continue;
            }

            if(match.matchDate > new Date()) {
                this.logger.warn(`Match date is in the future for pool: ${pool.id}`);
                continue;
            }

            this.logger.log(`Found match for pool: ${pool.id} - Match ID: ${match.id}`);
            
            // check if the matches are finished
            if (match.status.toLowerCase() != CricketPoolStatus.Finished) {
                this.logger.warn(`Match not finished for pool: ${pool.id}`);
                continue;
            }
            // update the pool results based on the finished matches
            try {
                const updatedPool = await this.cricketPoolService.updatePoolResults(pool.id, match);
                this.logger.log(`Updated pool results for pool: ${updatedPool.id} | Home Result: ${updatedPool.homeResult}, Away Result: ${updatedPool.awayResult}`);
            } catch (error) {
                this.logger.error(`Error updating pool results for pool: ${pool.id}`, error);
            }
        }
    }

    /**
     * This cron job runs every day at 1am to create pools for all matches that don't have one yet
     */
    @Cron('0 1 * * *') // Runs every day at 1am
    async createPoolsForMatches() {
        this.logger.log('Starting pool creation for matches...');
        const matches = await this.cricketMatchService.findAll();
        const pools = await this.cricketPoolService.findAll();
        const poolMatchIds = new Set(pools.map(pool => pool.cricketMatchId));
        let createdCount = 0;
        for (const match of matches) {
            if (!poolMatchIds.has(match.id)) {
                const newPool = new CricketPool(match.id);
                newPool.status = CricketPoolStatus.Pending;
                newPool.homeResult = null;
                newPool.awayResult = null;
                await this.cricketPoolService.create(newPool);
                this.logger.log(`Created pool for match: ${match.id}`);
                createdCount++;
            }
        }
        this.logger.log(`Pool creation complete. Total new pools created: ${createdCount}`);
    }

}
