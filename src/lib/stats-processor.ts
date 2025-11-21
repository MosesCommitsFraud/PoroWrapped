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

      challenges?: any;
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
      };

      objectives: {
            dragons: number;
            barons: number;
            towers: number;
            heralds: number; // Usually team based, but we can track team totals if user won? Or just sum from challenges if available
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

      gameModes: Record<number, { name: string; games: number; wins: number }>;

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
      spells: Record<number, { count: number; wins: number }>;

      teammates: Record<string, TeammateStats>;
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
            kda: 0,
            totalKills: 0,
            totalDeaths: 0,
            totalAssists: 0,
            combat: { totalDamageDealt: 0, totalDamageTaken: 0, totalMitigated: 0, totalHealing: 0, totalCCScore: 0 },
            objectives: { dragons: 0, barons: 0, towers: 0, heralds: 0 },
            pings: { allIn: 0, assist: 0, bait: 0, basic: 0, command: 0, danger: 0, missing: 0, enemyVision: 0, getBack: 0, needVision: 0, onMyWay: 0, push: 0, visionCleared: 0, total: 0 },
            streaks: { currentWin: 0, currentLoss: 0, longestWin: 0, longestLoss: 0 },
            activity: { hourly: {}, daily: {} },
            gameModes: {},
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
            spells: {},
            teammates: {},
      };

      // Sort matches by creation time for streaks
      const sortedMatches = [...matches].sort((a, b) => a.info.gameCreation - b.info.gameCreation);

      let currentWinStreak = 0;
      let currentLossStreak = 0;

      sortedMatches.forEach(match => {
            const participant = match.info.participants.find(p => p.puuid === targetPuuid);
            if (!participant) return;

            stats.totalGames++;
            stats.totalTimePlayed += match.info.gameDuration;

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

            // Objectives (Team based mostly, but challenges can help)
            // We can sum up team objectives if the user won, or just look at challenges
            // Let's use team objectives for now as a proxy for "Objectives taken while I was on the team"
            const team = match.info.teams.find(t => t.teamId === participant.teamId);
            if (team) {
                  stats.objectives.dragons += team.objectives.dragon.kills;
                  stats.objectives.barons += team.objectives.baron.kills;
                  stats.objectives.towers += team.objectives.tower.kills;
                  stats.objectives.heralds += team.objectives.riftHerald.kills;
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
                  stats.gameModes[queueId] = { name, games: 0, wins: 0 };
            }
            stats.gameModes[queueId].games++;
            if (participant.win) stats.gameModes[queueId].wins++;

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

            // Item Stats
            const items = [participant.item0, participant.item1, participant.item2, participant.item3, participant.item4, participant.item5, participant.item6];
            items.forEach(itemId => {
                  if (itemId === 0) return;
                  if (!stats.items[itemId]) {
                        stats.items[itemId] = { id: itemId, count: 0, wins: 0 };
                  }
                  stats.items[itemId].count++;
                  if (participant.win) stats.items[itemId].wins++;
            });

            // Spells
            [participant.summoner1Id, participant.summoner2Id].forEach(spellId => {
                  if (!stats.spells[spellId]) stats.spells[spellId] = { count: 0, wins: 0 };
                  stats.spells[spellId].count++;
                  if (participant.win) stats.spells[spellId].wins++;
            });

            // Teammates
            match.info.participants.forEach(p => {
                  if (p.puuid === targetPuuid) return;
                  if (p.teamId === participant.teamId) {
                        const name = p.summonerName || 'Unknown'; // Sometimes summonerName is empty in bots/customs
                        if (!stats.teammates[name]) {
                              stats.teammates[name] = { name, games: 0, wins: 0 };
                        }
                        stats.teammates[name].games++;
                        if (participant.win) stats.teammates[name].wins++;
                  }
            });
      });

      // Averages
      if (stats.totalGames > 0) {
            stats.winrate = (stats.wins / stats.totalGames) * 100;
            stats.averageGameDuration = stats.totalTimePlayed / stats.totalGames;
            stats.kda = (stats.totalKills + stats.totalAssists) / Math.max(1, stats.totalDeaths);
            stats.averageTimeSpentDead = stats.totalTimeSpentDead / stats.totalGames;
            stats.averageGold = stats.totalGold / stats.totalGames;
            stats.averageCS = stats.totalCS / stats.totalGames;
            stats.averageVisionScore = stats.visionScore / stats.totalGames;
      }

      return stats;
}
