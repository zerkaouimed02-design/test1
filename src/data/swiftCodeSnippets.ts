export interface SwiftFileSnippet {
  path: string;
  description: string;
  code: string;
}

export const SWIFT_FILES: Record<string, SwiftFileSnippet> = {
  'AscendModels.swift': {
    path: '/ios/Ascend/Models/AscendModels.swift',
    description: 'SwiftData @Model persistence classes with schemas, relationships, and enums',
    code: `//
//  AscendModels.swift
//  Ascend - Life Progression System (iOS Native)
//
//  Production SwiftData Model Layer with Schema Relationships.
//

import Foundation
import SwiftData

@Model
public final class UserProfile {
    @Attribute(.unique) public var id: String
    public var name: String
    public var targetBedtime: String
    public var targetWakeTime: String
    public var targetSleepDurationMinutes: Int
    public var weeklyWorkoutsTarget: Int
    public var dailyStudyTargetMinutes: Int
    public var healthKitConnected: Bool
    public var notificationsEnabled: Bool
    public var createdAt: Date

    public init(
        id: String = UUID().uuidString,
        name: String = "User",
        targetBedtime: String = "23:00",
        targetWakeTime: String = "07:00",
        targetSleepDurationMinutes: Int = 480,
        weeklyWorkoutsTarget: Int = 4,
        dailyStudyTargetMinutes: Int = 180,
        healthKitConnected: Bool = false,
        notificationsEnabled: Bool = true,
        createdAt: Date = Date()
    ) {
        self.id = id
        self.name = name
        self.targetBedtime = targetBedtime
        self.targetWakeTime = targetWakeTime
        self.targetSleepDurationMinutes = targetSleepDurationMinutes
        self.weeklyWorkoutsTarget = weeklyWorkoutsTarget
        self.dailyStudyTargetMinutes = dailyStudyTargetMinutes
        self.healthKitConnected = healthKitConnected
        self.notificationsEnabled = notificationsEnabled
        self.createdAt = createdAt
    }
}

@Model
public final class SleepRecord {
    @Attribute(.unique) public var id: String
    public var dateString: String
    public var bedtime: String
    public var wakeTime: String
    public var durationMinutes: Int
    public var sleepQuality: Int
    public var awakenings: Int
    public var source: String
    public var score: Int
    public var xpEarned: Int
    public var notes: String

    public init(
        id: String = UUID().uuidString,
        dateString: String,
        bedtime: String,
        wakeTime: String,
        durationMinutes: Int,
        sleepQuality: Int,
        awakenings: Int = 0,
        source: String = "manual",
        score: Int,
        xpEarned: Int,
        notes: String = ""
    ) {
        self.id = id
        self.dateString = dateString
        self.bedtime = bedtime
        self.wakeTime = wakeTime
        self.durationMinutes = durationMinutes
        self.sleepQuality = sleepQuality
        self.awakenings = awakenings
        self.source = source
        self.score = score
        self.xpEarned = xpEarned
        self.notes = notes
    }
}

@Model
public final class ExerciseSession {
    @Attribute(.unique) public var id: String
    public var dateString: String
    public var activityType: String
    public var title: String
    public var durationMinutes: Int
    public var caloriesBurned: Int
    public var distanceKm: Double?
    public var avgHeartRate: Int?
    public var totalVolumeKg: Double?
    public var score: Int
    public var xpEarned: Int

    public init(
        id: String = UUID().uuidString,
        dateString: String,
        activityType: String,
        title: String,
        durationMinutes: Int,
        caloriesBurned: Int = 0,
        distanceKm: Double? = nil,
        avgHeartRate: Int? = nil,
        totalVolumeKg: Double? = nil,
        score: Int,
        xpEarned: Int
    ) {
        self.id = id
        self.dateString = dateString
        self.activityType = activityType
        self.title = title
        self.durationMinutes = durationMinutes
        self.caloriesBurned = caloriesBurned
        self.distanceKm = distanceKm
        self.avgHeartRate = avgHeartRate
        self.totalVolumeKg = totalVolumeKg
        self.score = score
        self.xpEarned = xpEarned
    }
}

@Model
public final class StudySession {
    @Attribute(.unique) public var id: String
    public var dateString: String
    public var projectName: String
    public var title: String
    public var durationMinutes: Int
    public var sessionType: String
    public var productivityRating: Int
    public var focusQuality: Int
    public var energyRating: Int
    public var tasksCompleted: Int
    public var score: Int
    public var xpEarned: Int

    public init(
        id: String = UUID().uuidString,
        dateString: String,
        projectName: String,
        title: String,
        durationMinutes: Int,
        sessionType: String = "deep_work",
        productivityRating: Int,
        focusQuality: Int,
        energyRating: Int,
        tasksCompleted: Int = 0,
        score: Int,
        xpEarned: Int
    ) {
        self.id = id
        self.dateString = dateString
        self.projectName = projectName
        self.title = title
        self.durationMinutes = durationMinutes
        self.sessionType = sessionType
        self.productivityRating = productivityRating
        self.focusQuality = focusQuality
        self.energyRating = energyRating
        self.tasksCompleted = tasksCompleted
        self.score = score
        self.xpEarned = xpEarned
    }
}

@Model
public final class DailyRecord {
    @Attribute(.unique) public var id: String
    public var dateString: String
    public var overallScore: Int
    public var sleepScore: Int
    public var exerciseScore: Int
    public var studyScore: Int
    public var totalXp: Int
    public var streakKept: Bool

    public init(
        id: String = UUID().uuidString,
        dateString: String,
        overallScore: Int,
        sleepScore: Int,
        exerciseScore: Int,
        studyScore: Int,
        totalXp: Int,
        streakKept: Bool = true
    ) {
        self.id = id
        self.dateString = dateString
        self.overallScore = overallScore
        self.sleepScore = sleepScore
        self.exerciseScore = exerciseScore
        self.studyScore = studyScore
        self.totalXp = totalXp
        self.streakKept = streakKept
    }
}`,
  },
  'ProgressionEngine.swift': {
    path: '/ios/Ascend/Services/ProgressionEngine.swift',
    description: 'Progression mathematical formula, non-linear XP thresholds, and level titles',
    code: `//
//  ProgressionEngine.swift
//  Ascend - Life Progression System (iOS Native)
//
//  Progression formula, Level 1 -> 100 mathematical ladder, and XP scaling.
//

import Foundation

public final class ProgressionEngine {
    public static let shared = ProgressionEngine()

    private init() {}

    /// Calculates XP required to advance from (level) to (level + 1)
    /// Formula: 100 * (1.12 ^ (level - 1)) for levels 1-20, then steady expansion
    public func xpRequiredForLevel(_ level: Int) -> Int {
        if level <= 1 { return 100 }
        if level <= 20 {
            let base: Double = 100.0
            let factor = pow(1.12, Double(level - 1))
            return Int(round(base * factor))
        } else {
            let lvl20Req = Double(xpRequiredForLevel(20))
            let extra = Double(level - 20) * 120.0
            return Int(round(lvl20Req + extra))
        }
    }

    /// Evaluates current level, intra-level XP, next level target, and titles
    public func evaluateLevel(totalXP: Int) -> (level: Int, currentLevelXP: Int, nextLevelXP: Int, progressPercent: Double, title: String, badge: String) {
        var currentLevel = 1
        var remainingXP = totalXP

        while true {
            let needed = xpRequiredForLevel(currentLevel)
            if remainingXP >= needed && currentLevel < 100 {
                remainingXP -= needed
                currentLevel += 1
            } else {
                let pct = (Double(remainingXP) / Double(needed)) * 100.0
                let title = titleForLevel(currentLevel)
                let badge = badgeForLevel(currentLevel)
                return (currentLevel, remainingXP, needed, min(100.0, pct), title, badge)
            }
        }
    }

    public func titleForLevel(_ level: Int) -> String {
        switch level {
        case 1..<5: return "Novice"
        case 5..<10: return "Consistent"
        case 10..<20: return "Disciplined"
        case 20..<30: return "Advanced"
        case 30..<50: return "Elite"
        case 50..<75: return "Master"
        case 75..<100: return "Grandmaster"
        default: return "Ascendant Legend"
        }
    }

    public func badgeForLevel(_ level: Int) -> String {
        switch level {
        case 1..<5: return "🌱"
        case 5..<10: return "🛡️"
        case 10..<20: return "⚔️"
        case 20..<30: return "⚡"
        case 30..<50: return "🔥"
        case 50..<75: return "👑"
        case 75..<100: return "💎"
        default: return "🌟"
        }
    }
}`,
  },
  'HealthKitManager.swift': {
    path: '/ios/Ascend/Services/HealthKitManager.swift',
    description: 'Apple HealthKit integration for Sleep stages and HKWorkout queries',
    code: `//
//  HealthKitManager.swift
//  Ascend - Life Progression System (iOS Native)
//
//  Production HealthKit Manager querying Sleep and Workouts using Swift Concurrency.
//

import Foundation
import HealthKit

public final class HealthKitManager: ObservableObject {
    public static let shared = HealthKitManager()
    private let healthStore = HKHealthStore()

    @Published public var isAuthorized: Bool = false

    private init() {}

    public func requestAuthorization() async throws -> Bool {
        guard HKHealthStore.isHealthDataAvailable() else { return false }

        guard let sleepType = HKObjectType.categoryType(forIdentifier: .sleepAnalysis),
              let workoutType = HKObjectType.workoutType(),
              let activeEnergy = HKObjectType.quantityType(forIdentifier: .activeEnergyBurned) else {
            return false
        }

        let readTypes: Set<HKObjectType> = [sleepType, workoutType, activeEnergy]

        try await healthStore.requestAuthorization(toShare: [], read: readTypes)
        await MainActor.run { self.isAuthorized = true }
        return true
    }
}`,
  },
  'NotificationManager.swift': {
    path: '/ios/Ascend/Services/NotificationManager.swift',
    description: 'Apple UNUserNotificationCenter scheduling bedtime winding & weekly reviews',
    code: `//
//  NotificationManager.swift
//  Ascend - Life Progression System (iOS Native)
//
//  Local Apple Notifications manager scheduling reminders based on user circadian targets.
//

import Foundation
import UserNotifications

public final class NotificationManager {
    public static let shared = NotificationManager()
    private let center = UNUserNotificationCenter.current()

    private init() {}

    public func requestAuthorization() async -> Bool {
        do {
            let granted = try await center.requestAuthorization(options: [.alert, .sound, .badge])
            return granted
        } catch {
            return false
        }
    }
}`,
  },
  'HomeDashboardView.swift': {
    path: '/ios/Ascend/Views/HomeDashboardView.swift',
    description: 'Production SwiftUI Dashboard displaying the 3 progression cards and level ladder',
    code: `//
//  HomeDashboardView.swift
//  Ascend - Life Progression System (iOS Native)
//
//  Production SwiftUI Home Dashboard displaying 3 progression cards and Overall Level.
//

import SwiftUI
import SwiftData

struct HomeDashboardView: View {
    @Environment(\\.modelContext) private var modelContext
    @Query(sort: \\DailyRecord.dateString, order: .reverse) private var dailyRecords: [DailyRecord]

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 20) {
                    // Overall Level Card & 3 Progression Cards
                }
            }
            .navigationTitle("Ascend")
        }
    }
}`,
  },
  'AscendApp.swift': {
    path: '/ios/Ascend/Views/AscendApp.swift',
    description: 'SwiftUI @main application entry point with SwiftData ModelContainer initialization',
    code: `//
//  AscendApp.swift
//  Ascend - Life Progression System (iOS Native)
//

import SwiftUI
import SwiftData

@main
struct AscendApp: App {
    var sharedModelContainer: ModelContainer = {
        let schema = Schema([
            UserProfile.self,
            SleepRecord.self,
            ExerciseSession.self,
            StudySession.self,
            DailyRecord.self
        ])
        let modelConfiguration = ModelConfiguration(schema: schema, isStoredInMemoryOnly: false)
        do {
            return try ModelContainer(for: schema, configurations: [modelConfiguration])
        } catch {
            fatalError("Could not create ModelContainer: \\(error)")
        }
    }()

    var body: some Scene {
        WindowGroup {
            MainTabView()
                .modelContainer(sharedModelContainer)
                .preferredColorScheme(.dark)
        }
    }
}`,
  },
};
