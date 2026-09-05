//
//  AscendModels.swift
//  Ascend - Life Progression System (iOS Native)
//
//  SwiftData Models defining the durable offline-first persistence schema.
//

import Foundation
import SwiftData

public enum CategoryType: String, Codable, CaseIterable {
    case sleep
    case exercise
    case study
    case overall
}

public enum ExerciseType: String, Codable, CaseIterable {
    case strength
    case running
    case walking
    case cycling
    case swimming
    case sports
    case hiit
    case mobility
    case other
}

@Model
public final class UserProfile {
    @Attribute(.unique) public var id: String
    public var name: String
    public var title: String
    public var targetSleepMinutes: Int
    public var targetExerciseMinutesPerWeek: Int
    public var dailyFocusMinutes: Int
    public var targetBedtime: String
    public var targetWakeTime: String
    public var hasCompletedOnboarding: Bool
    public var healthKitConnected: Bool
    public var createdAt: Date

    public init(
        id: String = UUID().uuidString,
        name: String = "Alex Rivera",
        title: String = "Dedicated Ascendant",
        targetSleepMinutes: Int = 450,
        targetExerciseMinutesPerWeek: Int = 180,
        dailyFocusMinutes: Int = 180,
        targetBedtime: String = "23:00",
        targetWakeTime: String = "07:00",
        hasCompletedOnboarding: Bool = false,
        healthKitConnected: Bool = false,
        createdAt: Date = Date()
    ) {
        self.id = id
        self.name = name
        self.title = title
        self.targetSleepMinutes = targetSleepMinutes
        self.targetExerciseMinutesPerWeek = targetExerciseMinutesPerWeek
        self.dailyFocusMinutes = dailyFocusMinutes
        self.targetBedtime = targetBedtime
        self.targetWakeTime = targetWakeTime
        self.hasCompletedOnboarding = hasCompletedOnboarding
        self.healthKitConnected = healthKitConnected
        self.createdAt = createdAt
    }
}

@Model
public final class SleepRecord {
    @Attribute(.unique) public var id: String
    public var dateString: String // "YYYY-MM-DD"
    public var bedtime: String
    public var wakeTime: String
    public var durationMinutes: Int
    public var timeInBedMinutes: Int
    public var quality: Int // 1-10
    public var awakenings: Int
    public var notes: String
    public var source: String // "manual" or "healthkit"
    public var score: Int
    public var xpEarned: Int

    public init(
        id: String = UUID().uuidString,
        dateString: String,
        bedtime: String,
        wakeTime: String,
        durationMinutes: Int,
        timeInBedMinutes: Int,
        quality: Int,
        awakenings: Int = 0,
        notes: String = "",
        source: String = "manual",
        score: Int = 0,
        xpEarned: Int = 0
    ) {
        self.id = id
        self.dateString = dateString
        self.bedtime = bedtime
        self.wakeTime = wakeTime
        self.durationMinutes = durationMinutes
        self.timeInBedMinutes = timeInBedMinutes
        self.quality = quality
        self.awakenings = awakenings
        self.notes = notes
        self.source = source
        self.score = score
        self.xpEarned = xpEarned
    }
}

@Model
public final class ExerciseSession {
    @Attribute(.unique) public var id: String
    public var dateString: String
    public var activityTypeRaw: String
    public var title: String
    public var durationMinutes: Int
    public var caloriesBurned: Int?
    public var distanceKm: Double?
    public var paceMinPerKm: String?
    public var intensityRaw: String
    public var totalVolumeKg: Double?
    public var notes: String
    public var source: String
    public var score: Int
    public var xpEarned: Int

    public var activityType: ExerciseType {
        ExerciseType(rawValue: activityTypeRaw) ?? .other
    }

    public init(
        id: String = UUID().uuidString,
        dateString: String,
        activityType: ExerciseType,
        title: String,
        durationMinutes: Int,
        caloriesBurned: Int? = nil,
        distanceKm: Double? = nil,
        paceMinPerKm: String? = nil,
        intensity: String = "moderate",
        totalVolumeKg: Double? = nil,
        notes: String = "",
        source: String = "manual",
        score: Int = 0,
        xpEarned: Int = 0
    ) {
        self.id = id
        self.dateString = dateString
        self.activityTypeRaw = activityType.rawValue
        self.title = title
        self.durationMinutes = durationMinutes
        self.caloriesBurned = caloriesBurned
        self.distanceKm = distanceKm
        self.paceMinPerKm = paceMinPerKm
        self.intensityRaw = intensity
        self.totalVolumeKg = totalVolumeKg
        self.notes = notes
        self.source = source
        self.score = score
        self.xpEarned = xpEarned
    }
}

@Model
public final class StudySession {
    @Attribute(.unique) public var id: String
    public var dateString: String
    public var projectId: String?
    public var projectName: String?
    public var title: String
    public var durationMinutes: Int
    public var sessionType: String // "pomodoro", "deep_work", "custom"
    public var productivityRating: Int // 1-10
    public var focusQuality: Int // 1-10
    public var energyRating: Int // 1-10
    public var difficultyRating: Int // 1-10
    public var distractionFactorsList: [String]
    public var tasksCompleted: Int
    public var notes: String
    public var score: Int
    public var xpEarned: Int

    public init(
        id: String = UUID().uuidString,
        dateString: String,
        projectId: String? = nil,
        projectName: String? = nil,
        title: String,
        durationMinutes: Int,
        sessionType: String = "pomodoro",
        productivityRating: Int = 8,
        focusQuality: Int = 8,
        energyRating: Int = 8,
        difficultyRating: Int = 7,
        distractionFactorsList: [String] = [],
        tasksCompleted: Int = 0,
        notes: String = "",
        score: Int = 0,
        xpEarned: Int = 0
    ) {
        self.id = id
        self.dateString = dateString
        self.projectId = projectId
        self.projectName = projectName
        self.title = title
        self.durationMinutes = durationMinutes
        self.sessionType = sessionType
        self.productivityRating = productivityRating
        self.focusQuality = focusQuality
        self.energyRating = energyRating
        self.difficultyRating = difficultyRating
        self.distractionFactorsList = distractionFactorsList
        self.tasksCompleted = tasksCompleted
        self.notes = notes
        self.score = score
        self.xpEarned = xpEarned
    }
}

@Model
public final class DailyRecord {
    @Attribute(.unique) public var dateString: String
    public var sleepScore: Int
    public var exerciseScore: Int
    public var studyScore: Int
    public var overallScore: Int
    public var totalXp: Int
    public var sleepMinutes: Int
    public var exerciseMinutes: Int
    public var studyMinutes: Int
    public var isRestDay: Bool

    public init(
        dateString: String,
        sleepScore: Int = 0,
        exerciseScore: Int = 0,
        studyScore: Int = 0,
        overallScore: Int = 0,
        totalXp: Int = 0,
        sleepMinutes: Int = 0,
        exerciseMinutes: Int = 0,
        studyMinutes: Int = 0,
        isRestDay: Bool = false
    ) {
        self.dateString = dateString
        self.sleepScore = sleepScore
        self.exerciseScore = exerciseScore
        self.studyScore = studyScore
        self.overallScore = overallScore
        self.totalXp = totalXp
        self.sleepMinutes = sleepMinutes
        self.exerciseMinutes = exerciseMinutes
        self.studyMinutes = studyMinutes
        self.isRestDay = isRestDay
    }
}
