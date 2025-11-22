export interface Match {
      metadata: {
            matchId: string;
            participants: string[];
      };
      info: {
            gameCreation: number;
            gameDuration: number;
            gameMode: string;
            gameType: string;
            queueId: number;
            participants: Participant[];
            teams: Team[];
      };
}

export interface Participant {
      puuid: string;
      summonerName: string;
      riotIdGameName?: string;
      riotIdTagLine?: string;
      championName: string;
      championId: number;
      win: boolean;
      kills: number;
      deaths: number;
      assists: number;

      // Combat
      totalDamageDealtToChampions: number;
      totalDamageTaken: number;
      damageSelfMitigated: number;
      totalHeal: number;
      timeCCingOthers: number;

      // Economy & Farming
      goldEarned: number;
      totalMinionsKilled: number;
      neutralMinionsKilled: number;

      // Vision
      visionScore: number;
      wardsPlaced: number;
      wardsKilled: number;
      detectorWardsPlaced: number;

      // Items
      item0: number;
      item1: number;
      item2: number;
      item3: number;
      item4: number;
      item5: number;
      item6: number;

      // Spells
      summoner1Id: number;
      summoner2Id: number;

      // MultiKills
      pentaKills: number;
      quadraKills: number;
      tripleKills: number;
      doubleKills: number;

      // Misc
      totalTimeSpentDead: number;
      teamId: number;
      individualPosition: string;

      // Pings
      allInPings?: number;
      assistMePings?: number;
      baitPings?: number;
      basicPings?: number;
      commandPings?: number;
      dangerPings?: number;
      enemyMissingPings?: number;
      enemyVisionPings?: number;
      getBackPings?: number;
      needVisionPings?: number;
      onMyWayPings?: number;
      pushPings?: number;
      visionClearedPings?: number;

      // Objectives (Challenges often have better data for individual contribution)
      dragonKills?: number;
      baronKills?: number;
      objectivesStolen?: number;
      turretKills?: number;

      challenges?: {
            abilityUses?: number;
            spell1Casts?: number;
            spell2Casts?: number;
            spell3Casts?: number;
            spell4Casts?: number;
            scuttleCrabKills?: number;
            snowballsHit?: number;
            takedownsBeforeJungleMinionSpawn?: number;
            killParticipation?: number;
            kda?: number;
            [key: string]: any;
      };
      champLevel: number;
      firstBloodKill: boolean;
      firstBloodAssist: boolean;
}

export interface Team {
      teamId: number;
      win: boolean;
      objectives: {
            baron: { kills: number };
            dragon: { kills: number };
            tower: { kills: number };
            riftHerald: { kills: number };
      };
}

export interface AggregateStats {
      totalGames: number;
      wins: number;
      losses: number;
      winrate: number;
      totalTimePlayed: number; // seconds
      averageGameDuration: number;

      levels: {
            total: number;
            avg: number;
      };

      kda: number;
      totalKills: number;
      totalDeaths: number;
      totalAssists: number;

      combat: {
            totalDamageDealt: number;
            totalDamageTaken: number;
            totalMitigated: number;
            totalHealing: number;
            totalCCScore: number;
            firstBloods: number; // Kills + Assists
      };

      objectives: {
            dragons: number;
            barons: number;
            towers: number;
            heralds: number;
            scuttles: number;
            earlyTakedowns: number; // Before first camp spawn (approx 1:30)
      };

      pings: {
            allIn: number;
            assist: number;
            bait: number;
            basic: number;
            command: number;
            danger: number;
            missing: number;
            enemyVision: number;
            getBack: number;
            needVision: number;
            onMyWay: number;
            push: number;
            visionCleared: number;
            total: number;
      };

      streaks: {
            currentWin: number;
            currentLoss: number;
            longestWin: number;
            longestLoss: number;
      };

      activity: {
            hourly: Record<number, number>; // 0-23
            daily: Record<number, number>; // 0-6 (Sun-Sat)
      };

      gameModes: Record<number, {
            name: string;
            games: number;
            wins: number;
            timePlayed: number;
      }>;

      arena: {
            games: number;
            wins: number;
            placements: Record<number, number>; // 1st, 2nd, etc.
            augments: Record<string, number>; // Most used augments
      };

      aram: {
            games: number;
            wins: number;
            snowballsHit: number;
      };

      totalMultiKills: {
            penta: number;
            quadra: number;
            triple: number;
            double: number;
      };

      totalTimeSpentDead: number;
      averageTimeSpentDead: number;

      totalGold: number;
      averageGold: number;
      totalCS: number;
      averageCS: number;

      visionScore: number;
      averageVisionScore: number;

      sideSelection: {
            blue: { games: number; wins: number };
            red: { games: number; wins: number };
      };

      champions: Record<string, ChampionStats>;
      items: Record<number, ItemStats>;
      itemBuilds: Record<number, number[]>; // Adjacency list for item connections (Item A -> Item B)
      spells: Record<number, { count: number; wins: number }>;
      abilityCasts: {
            q: number;
            w: number;
            e: number;
            r: number;
      };

      teammates: Record<string, TeammateStats>;
      enemies: Record<string, TeammateStats>; // Reusing TeammateStats structure for enemies

      social: {
            uniqueTeammates: number;
            uniqueEnemies: number;
            friends: Record<string, { games: number; wins: number; kda: number }>; // Played with > 2 times
      };

      nemesis: {
            worstEnemy: { name: string; losses: number };
            worstChamp: { name: string; winrate: number; games: number };
            worstItem: { id: number; winrate: number; games: number };
      };
      best: {
            bestFriend: { name: string; wins: number };
            bestChamp: { name: string; winrate: number; games: number };
            bestItem: { id: number; winrate: number; games: number };
            rival: { name: string; kills: number }; // Enemy you killed the most (requires kill events, maybe approximate with "won against"?)
            // Actually "Enemy you stomped" -> Won against most
            stompedEnemy: { name: string; wins: number };
      };
}

export interface ChampionStats {
      name: string;
      games: number;
      wins: number;
      kills: number;
      deaths: number;
      assists: number;
      cs: number;
      gold: number;
      damageDealt: number;
      damageTanked: number;
      timePlayed: number;
}

export interface ItemStats {
      id: number;
      count: number;
      wins: number;
}

export interface TeammateStats {
      name: string;
      games: number;
      wins: number;
}

export function processMatches(matches: Match[], targetPuuid: string): AggregateStats {
      const stats: AggregateStats = {
            totalGames: 0,
            wins: 0,
            losses: 0,
            winrate: 0,
            totalTimePlayed: 0,
            averageGameDuration: 0,
            levels: { total: 0, avg: 0 },
            kda: 0,
            totalKills: 0,
            totalDeaths: 0,
            totalAssists: 0,
            combat: { totalDamageDealt: 0, totalDamageTaken: 0, totalMitigated: 0, totalHealing: 0, totalCCScore: 0, firstBloods: 0 },
            objectives: { dragons: 0, barons: 0, towers: 0, heralds: 0, scuttles: 0, earlyTakedowns: 0 },
            pings: { allIn: 0, assist: 0, bait: 0, basic: 0, command: 0, danger: 0, missing: 0, enemyVision: 0, getBack: 0, needVision: 0, onMyWay: 0, push: 0, visionCleared: 0, total: 0 },
            streaks: { currentWin: 0, currentLoss: 0, longestWin: 0, longestLoss: 0 },
            activity: { hourly: {}, daily: {} },
            gameModes: {},
            arena: { games: 0, wins: 0, placements: {}, augments: {} },
            aram: { games: 0, wins: 0, snowballsHit: 0 },
            totalMultiKills: { penta: 0, quadra: 0, triple: 0, double: 0 },
            totalTimeSpentDead: 0,
            averageTimeSpentDead: 0,
            totalGold: 0,
            averageGold: 0,
            totalCS: 0,
            averageCS: 0,
            visionScore: 0,
            averageVisionScore: 0,
            sideSelection: { blue: { games: 0, wins: 0 }, red: { games: 0, wins: 0 } },
            champions: {},
            items: {},
            itemBuilds: {},
            spells: {},
            abilityCasts: { q: 0, w: 0, e: 0, r: 0 },
            teammates: {},
            enemies: {},
            social: { uniqueTeammates: 0, uniqueEnemies: 0, friends: {} },
            nemesis: { worstEnemy: { name: '', losses: 0 }, worstChamp: { name: '', winrate: 0, games: 0 }, worstItem: { id: 0, winrate: 0, games: 0 } },
            best: { bestFriend: { name: '', wins: 0 }, bestChamp: { name: '', winrate: 0, games: 0 }, bestItem: { id: 0, winrate: 0, games: 0 }, rival: { name: '', kills: 0 }, stompedEnemy: { name: '', wins: 0 } },
      };

      // Sort matches by creation time for streaks
      const sortedMatches = [...matches].sort((a, b) => a.info.gameCreation - b.info.gameCreation);

      let currentWinStreak = 0;
      let currentLossStreak = 0;

      const teammateGames: Record<string, { games: number, wins: number, kdaSum: number }> = {};
      const enemyGames: Record<string, { games: number, wins: number, losses: number }> = {};

      sortedMatches.forEach(match => {
            const participant = match.info.participants.find(p => p.puuid === targetPuuid);
            if (!participant) return;

            stats.totalGames++;
            stats.totalTimePlayed += match.info.gameDuration;

            // Levels
            stats.levels.total += participant.champLevel;

            // Win/Loss & Streaks
            if (participant.win) {
                  stats.wins++;
                  currentWinStreak++;
                  currentLossStreak = 0;
                  if (currentWinStreak > stats.streaks.longestWin) stats.streaks.longestWin = currentWinStreak;
            } else {
                  stats.losses++;
                  currentLossStreak++;
                  currentWinStreak = 0;
                  if (currentLossStreak > stats.streaks.longestLoss) stats.streaks.longestLoss = currentLossStreak;
            }

            // Basic KDA
            stats.totalKills += participant.kills;
            stats.totalDeaths += participant.deaths;
            stats.totalAssists += participant.assists;

            // Combat
            stats.combat.totalDamageDealt += participant.totalDamageDealtToChampions;
            stats.combat.totalDamageTaken += participant.totalDamageTaken;
            stats.combat.totalMitigated += participant.damageSelfMitigated;
            stats.combat.totalHealing += participant.totalHeal;
            stats.combat.totalCCScore += participant.timeCCingOthers;
            if (participant.firstBloodKill || participant.firstBloodAssist) {
                  stats.combat.firstBloods++;
            }

            // MultiKills
            stats.totalMultiKills.penta += participant.pentaKills;
            stats.totalMultiKills.quadra += participant.quadraKills;
            stats.totalMultiKills.triple += participant.tripleKills;
            stats.totalMultiKills.double += participant.doubleKills;

            // Misc Stats
            stats.totalTimeSpentDead += participant.totalTimeSpentDead;
            stats.totalGold += participant.goldEarned;
            stats.totalCS += participant.totalMinionsKilled + participant.neutralMinionsKilled;
            stats.visionScore += participant.visionScore;

            // Objectives
            const team = match.info.teams.find(t => t.teamId === participant.teamId);
            if (team) {
                  stats.objectives.dragons += team.objectives.dragon.kills;
                  stats.objectives.barons += team.objectives.baron.kills;
                  stats.objectives.towers += team.objectives.tower.kills;
                  stats.objectives.heralds += team.objectives.riftHerald.kills;
            }
            // Challenges based objectives
            if (participant.challenges) {
                  stats.objectives.scuttles += participant.challenges.scuttleCrabKills || 0;
                  stats.objectives.earlyTakedowns += participant.challenges.takedownsBeforeJungleMinionSpawn || 0;

                  // Ability Casts
                  stats.abilityCasts.q += participant.challenges.spell1Casts || 0;
                  stats.abilityCasts.w += participant.challenges.spell2Casts || 0;
                  stats.abilityCasts.e += participant.challenges.spell3Casts || 0;
                  stats.abilityCasts.r += participant.challenges.spell4Casts || 0;

                  // ARAM Snowballs
                  if (match.info.queueId === 450) {
                        stats.aram.snowballsHit += participant.challenges.snowballsHit || 0;
                  }
            }

            // Pings
            stats.pings.allIn += participant.allInPings || 0;
            stats.pings.assist += participant.assistMePings || 0;
            stats.pings.bait += participant.baitPings || 0;
            stats.pings.basic += participant.basicPings || 0;
            stats.pings.command += participant.commandPings || 0;
            stats.pings.danger += participant.dangerPings || 0;
            stats.pings.missing += participant.enemyMissingPings || 0;
            stats.pings.enemyVision += participant.enemyVisionPings || 0;
            stats.pings.getBack += participant.getBackPings || 0;
            stats.pings.needVision += participant.needVisionPings || 0;
            stats.pings.onMyWay += participant.onMyWayPings || 0;
            stats.pings.push += participant.pushPings || 0;
            stats.pings.visionCleared += participant.visionClearedPings || 0;
            stats.pings.total =
                  stats.pings.allIn + stats.pings.assist + stats.pings.bait + stats.pings.basic +
                  stats.pings.command + stats.pings.danger + stats.pings.missing + stats.pings.enemyVision +
                  stats.pings.getBack + stats.pings.needVision + stats.pings.onMyWay + stats.pings.push +
                  stats.pings.visionCleared;

            // Activity
            const date = new Date(match.info.gameCreation);
            const hour = date.getHours();
            const day = date.getDay();
            stats.activity.hourly[hour] = (stats.activity.hourly[hour] || 0) + 1;
            stats.activity.daily[day] = (stats.activity.daily[day] || 0) + 1;

            // Game Modes
            const queueId = match.info.queueId;
            if (!stats.gameModes[queueId]) {
                  let name = 'Unknown';
                  if (queueId === 420) name = 'Ranked Solo';
                  else if (queueId === 440) name = 'Ranked Flex';
                  else if (queueId === 450) name = 'ARAM';
                  else if (queueId === 1700) name = 'Arena';
                  else if (queueId === 400) name = 'Normal Draft';
                  else if (queueId === 430) name = 'Normal Blind';
                  else if (queueId === 1900) name = 'URF';
                  stats.gameModes[queueId] = { name, games: 0, wins: 0, timePlayed: 0 };
            }
            stats.gameModes[queueId].games++;
            stats.gameModes[queueId].timePlayed += match.info.gameDuration;
            if (participant.win) stats.gameModes[queueId].wins++;

            // ARAM & Arena Specifics
            if (queueId === 450) {
                  stats.aram.games++;
                  if (participant.win) stats.aram.wins++;
            } else if (queueId === 1700) {
                  stats.arena.games++;
                  if (participant.win) stats.arena.wins++; // Top 2 counts as win usually, but API 'win' might be 1st place.
                  // Arena placement is usually in challenges or subteamPlacement
                  const placement = participant.challenges?.placement || 0; // Need to verify if this is where it is
                  if (placement > 0) {
                        stats.arena.placements[placement] = (stats.arena.placements[placement] || 0) + 1;
                  }
                  // Augments are in playerAugment1, playerAugment2 etc. in match v5 for Arena? 
                  // Actually they are often in `challenges` or separate fields depending on version.
                  // For now, let's skip augments unless we see them in the API response structure clearly.
            }

            // Side selection
            if (participant.teamId === 100) { // Blue side
                  stats.sideSelection.blue.games++;
                  if (participant.win) stats.sideSelection.blue.wins++;
            } else { // Red side
                  stats.sideSelection.red.games++;
                  if (participant.win) stats.sideSelection.red.wins++;
            }

            // Champion Stats
            if (!stats.champions[participant.championName]) {
                  stats.champions[participant.championName] = {
                        name: participant.championName,
                        games: 0,
                        wins: 0,
                        kills: 0,
                        deaths: 0,
                        assists: 0,
                        cs: 0,
                        gold: 0,
                        damageDealt: 0,
                        damageTanked: 0,
                        timePlayed: 0,
                  };
            }
            const champ = stats.champions[participant.championName];
            champ.games++;
            if (participant.win) champ.wins++;
            champ.kills += participant.kills;
            champ.deaths += participant.deaths;
            champ.assists += participant.assists;
            champ.cs += participant.totalMinionsKilled + participant.neutralMinionsKilled;
            champ.gold += participant.goldEarned;
            champ.damageDealt += participant.totalDamageDealtToChampions;
            champ.damageTanked += participant.totalDamageTaken + participant.damageSelfMitigated;
            champ.timePlayed += match.info.gameDuration;

            // Item Stats & Builds
            const items = [participant.item0, participant.item1, participant.item2, participant.item3, participant.item4, participant.item5, participant.item6];
            const activeItems = items.filter(id => id !== 0);

            activeItems.forEach((itemId, index) => {
                  if (!stats.items[itemId]) {
                        stats.items[itemId] = { id: itemId, count: 0, wins: 0 };
                  }
                  stats.items[itemId].count++;
                  if (participant.win) stats.items[itemId].wins++;

                  // Build paths (adjacency)
                  if (index < activeItems.length - 1) {
                        const nextItem = activeItems[index + 1];
                        if (!stats.itemBuilds[itemId]) stats.itemBuilds[itemId] = [];
                        stats.itemBuilds[itemId].push(nextItem);
                  }
            });

            // Spells
            [participant.summoner1Id, participant.summoner2Id].forEach(spellId => {
                  if (!stats.spells[spellId]) stats.spells[spellId] = { count: 0, wins: 0 };
                  stats.spells[spellId].count++;
                  if (participant.win) stats.spells[spellId].wins++;
            });

            // Teammates & Enemies
            const matchKda = (participant.kills + participant.assists) / Math.max(1, participant.deaths);

            match.info.participants.forEach(p => {
                  if (p.puuid === targetPuuid) return;
                  const name = p.summonerName || p.riotIdGameName || 'Unknown';

                  if (p.teamId === participant.teamId) {
                        // Teammate
                        if (!teammateGames[name]) teammateGames[name] = { games: 0, wins: 0, kdaSum: 0 };
                        teammateGames[name].games++;
                        if (participant.win) teammateGames[name].wins++;
                        teammateGames[name].kdaSum += matchKda;

                        // Update Aggregate Teammates
                        if (!stats.teammates[name]) stats.teammates[name] = { name, games: 0, wins: 0 };
                        stats.teammates[name].games++;
                        if (participant.win) stats.teammates[name].wins++;

                  } else {
                        // Enemy
                        if (!enemyGames[name]) enemyGames[name] = { games: 0, wins: 0, losses: 0 };
                        enemyGames[name].games++;
                        if (participant.win) enemyGames[name].losses++; // I won, so they lost
                        else enemyGames[name].wins++; // I lost, so they won

                        // Update Aggregate Enemies
                        if (!stats.enemies[name]) stats.enemies[name] = { name, games: 0, wins: 0 };
                        stats.enemies[name].games++;
                        if (!participant.win) stats.enemies[name].wins++; // They won
                  }
            });
      });

      // Final Aggregations & Averages
      if (stats.totalGames > 0) {
            stats.winrate = (stats.wins / stats.totalGames) * 100;
            stats.averageGameDuration = stats.totalTimePlayed / stats.totalGames;
            stats.kda = (stats.totalKills + stats.totalAssists) / Math.max(1, stats.totalDeaths);
            stats.averageTimeSpentDead = stats.totalTimeSpentDead / stats.totalGames;
            stats.averageGold = stats.totalGold / stats.totalGames;
            stats.averageCS = stats.totalCS / stats.totalGames;
            stats.averageVisionScore = stats.visionScore / stats.totalGames;
            stats.levels.avg = stats.levels.total / stats.totalGames;
      }

      // Social Stats Processing
      stats.social.uniqueTeammates = Object.keys(teammateGames).length;
      stats.social.uniqueEnemies = Object.keys(enemyGames).length;

      // Friends (played with > 2 times)
      Object.entries(teammateGames).forEach(([name, data]) => {
            if (data.games > 2) {
                  stats.social.friends[name] = {
                        games: data.games,
                        wins: data.wins,
                        kda: data.kdaSum / data.games
                  };
            }
      });

      // Best Friend (Most games played with)
      let maxGames = 0;
      let bestFriendName = '';
      Object.entries(teammateGames).forEach(([name, data]) => {
            if (data.games > maxGames) {
                  maxGames = data.games;
                  bestFriendName = name;
            }
      });
      if (bestFriendName) {
            stats.best.bestFriend = { name: bestFriendName, wins: teammateGames[bestFriendName].wins };
      }

      // Nemesis (Enemy lost most to) & Stomped (Enemy won most against)
      let maxLossesToEnemy = 0;
      let worstEnemyName = '';
      let maxWinsAgainstEnemy = 0;
      let stompedEnemyName = '';

      Object.entries(enemyGames).forEach(([name, data]) => {
            // Worst Enemy: They won against me (my losses)
            if (data.wins > maxLossesToEnemy) {
                  maxLossesToEnemy = data.wins;
                  worstEnemyName = name;
            }
            // Stomped Enemy: I won against them (my wins)
            if (data.losses > maxWinsAgainstEnemy) {
                  maxWinsAgainstEnemy = data.losses;
                  stompedEnemyName = name;
            }
      });
      if (worstEnemyName) stats.nemesis.worstEnemy = { name: worstEnemyName, losses: maxLossesToEnemy };
      if (stompedEnemyName) stats.best.stompedEnemy = { name: stompedEnemyName, wins: maxWinsAgainstEnemy };

      // Best/Worst Champ
      let bestChampName = '';
      let bestChampScore = -1;
      let worstChampName = '';
      let worstChampScore = 101; // Winrate > 100 impossible

      Object.values(stats.champions).forEach(champ => {
            if (champ.games < 3) return; // Min games threshold
            const wr = (champ.wins / champ.games) * 100;

            if (wr > bestChampScore) {
                  bestChampScore = wr;
                  bestChampName = champ.name;
            }
            if (wr < worstChampScore) {
                  worstChampScore = wr;
                  worstChampName = champ.name;
            }
      });
      if (bestChampName) stats.best.bestChamp = { name: bestChampName, winrate: bestChampScore, games: stats.champions[bestChampName].games };
      if (worstChampName) stats.nemesis.worstChamp = { name: worstChampName, winrate: worstChampScore, games: stats.champions[worstChampName].games };

      // Best/Worst Item (Min 5 games)
      let bestItem = 0;
      let bestItemScore = -1;
      let worstItem = 0;
      let worstItemScore = 101;

      Object.values(stats.items).forEach(item => {
            if (item.count < 5) return;
            const wr = (item.wins / item.count) * 100;

            if (wr > bestItemScore) {
                  bestItemScore = wr;
                  bestItem = item.id;
            }
            if (wr < worstItemScore) {
                  worstItemScore = wr;
                  worstItem = item.id;
            }
      });
      if (bestItem) stats.best.bestItem = { id: bestItem, winrate: bestItemScore, games: stats.items[bestItem].count };
      if (worstItem) stats.nemesis.worstItem = { id: worstItem, winrate: worstItemScore, games: stats.items[worstItem].count };

      return stats;
}
