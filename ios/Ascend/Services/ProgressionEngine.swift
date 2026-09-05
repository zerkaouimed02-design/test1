//
//  ProgressionEngine.swift
//  Ascend - Life Progression System (iOS Native)
//
//  Production-ready XP algorithm, Level scaling, and progression ladder.
//

import Foundation

public struct LevelProgressionResult {
    public let level: Int
    public let currentLevelXP: Int
    public let nextLevelXP: Int
    public let progressPercent: Double
    public let title: String
    public let badge: String
}

public final class ProgressionEngine {
    public static let shared = ProgressionEngine()

    private init() {}

    /// Calculates XP required for level `level` to reach `level + 1`.
    /// Progressively scales: 100, 112, 125, 140... up to level 100.
    public func getXPForNextLevel(level: Int) -> Int {
        guard level >= 1 else { return 100 }
        guard level < 100 else { return 999_999 }

        if level <= 20 {
            return Int(round(100.0 * pow(1.12, Double(level - 1))))
        } else if level <= 50 {
            return 800 + (level - 20) * 120
        } else {
            return 4400 + (level - 50) * 350
        }
    }

    /// Resolves title and emoji badge based on level tier.
    public func getTitle(for level: Int) -> (title: String, badge: String) {
        switch level {
        case 1...4:
            return ("Beginner", "🌱")
        case 5...9:
            return ("Consistent", "⚡")
        case 10...14:
            return ("Disciplined", "🛡️")
        case 15...19:
            return ("Dedicated", "🔥")
        case 20...29:
            return ("Advanced", "⚔️")
        case 30...49:
            return ("Elite", "💎")
        case 50...74:
            return ("Master", "👑")
        case 75...99:
            return ("Grandmaster", "🌌")
        default:
            return ("Ascendant Legend", "⭐")
        }
    }

    /// Evaluates total cumulative XP into current level, intra-level XP, and progress.
    public func evaluateLevel(totalXP: Int) -> LevelProgressionResult {
        var currentLevel = 1
        var remainingXP = max(0, totalXP)

        while currentLevel < 100 {
            let needed = getXPForNextLevel(level: currentLevel)
            if remainingXP >= needed {
                remainingXP -= needed
                currentLevel += 1
            } else {
                break
            }
        }

        let neededForNext = getXPForNextLevel(level: currentLevel)
        let percent = min(100.0, max(0.0, (Double(remainingXP) / Double(neededForNext)) * 100.0))
        let meta = getTitle(for: currentLevel)

        return LevelProgressionResult(
            level: currentLevel,
            currentLevelXP: remainingXP,
            nextLevelXP: neededForNext,
            progressPercent: percent,
            title: meta.title,
            badge: meta.badge
        )
    }

    /// Calculates Sleep Score (0-100) and breakdown
    public func calculateSleepScore(
        durationMinutes: Int,
        targetMinutes: Int,
        quality: Int,
        awakenings: Int
    ) -> (score: Int, xp: Int, durationScore: Int, qualityScore: Int) {
        let durDiff = abs(durationMinutes - targetMinutes)
        var durScore = 50
        if durDiff > 30 {
            let penalty = min(40, (durDiff - 30) / 15 * 3)
            durScore = max(10, 50 - penalty)
        }

        var qualScore = quality * 5 // max 50
        if awakenings > 1 {
            qualScore = max(10, qualScore - (awakenings - 1) * 4)
        }

        let total = min(100, max(10, durScore + qualScore))
        var xp = 30 + (total >= 85 ? 40 : 15)
        if durScore >= 45 { xp += 25 }

        return (score: total, xp: xp, durationScore: durScore, qualityScore: qualScore)
    }
}
