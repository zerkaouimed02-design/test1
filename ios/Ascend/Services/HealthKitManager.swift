//
//  HealthKitManager.swift
//  Ascend - Life Progression System (iOS Native)
//
//  Apple HealthKit authorization, background query, and safe graceful degradation.
//

import Foundation
import HealthKit

public protocol HealthKitManaging: AnyObject {
    var isAuthorized: Bool { get }
    func requestAuthorization() async throws -> Bool
    func fetchSleepData(for date: Date) async throws -> (durationMinutes: Int, inBedMinutes: Int)?
    func fetchWorkoutData(for date: Date) async throws -> [(title: String, durationMinutes: Int, calories: Int)]
}

public final class HealthKitManager: HealthKitManaging {
    public static let shared = HealthKitManager()

    private let healthStore = HKHealthStore()
    public private(set) var isAuthorized: Bool = false

    private init() {}

    public func requestAuthorization() async throws -> Bool {
        guard HKHealthStore.isHealthDataAvailable() else {
            return false
        }

        let sleepType = HKObjectType.categoryType(forIdentifier: .sleepAnalysis)!
        let workoutType = HKObjectType.workoutType()
        let activeEnergy = HKObjectType.quantityType(forIdentifier: .activeEnergyBurned)!

        let readTypes: Set<HKObjectType> = [sleepType, workoutType, activeEnergy]

        do {
            try await healthStore.requestAuthorization(toShare: [], read: readTypes)
            self.isAuthorized = true
            return true
        } catch {
            self.isAuthorized = false
            throw error
        }
    }

    public func fetchSleepData(for date: Date) async throws -> (durationMinutes: Int, inBedMinutes: Int)? {
        guard HKHealthStore.isHealthDataAvailable() else { return nil }

        let calendar = Calendar.current
        let startOfDay = calendar.startOfDay(for: date)
        guard let endOfDay = calendar.date(byAdding: .day, value: 1, to: startOfDay) else { return nil }

        let sleepType = HKObjectType.categoryType(forIdentifier: .sleepAnalysis)!
        let predicate = HKQuery.predicateForSamples(withStart: startOfDay, end: endOfDay, options: .strictStartDate)

        return try await withCheckedThrowingContinuation { continuation in
            let query = HKSampleQuery(
                sampleType: sleepType,
                predicate: predicate,
                limit: HKObjectQueryNoLimit,
                sortDescriptors: [NSSortDescriptor(key: HKSampleSortIdentifierStartDate, ascending: true)]
            ) { _, samples, error in
                if let error = error {
                    continuation.resume(throwing: error)
                    return
                }

                guard let categorySamples = samples as? [HKCategorySample], !categorySamples.isEmpty else {
                    continuation.resume(returning: nil)
                    return
                }

                var asleepSeconds: TimeInterval = 0
                var inBedSeconds: TimeInterval = 0

                for sample in categorySamples {
                    let duration = sample.endDate.timeIntervalSince(sample.startDate)
                    if #available(iOS 16.0, *) {
                        if sample.value == HKCategoryValueSleepAnalysis.asleepCore.rawValue ||
                           sample.value == HKCategoryValueSleepAnalysis.asleepDeep.rawValue ||
                           sample.value == HKCategoryValueSleepAnalysis.asleepREM.rawValue {
                            asleepSeconds += duration
                        }
                    } else {
                        if sample.value == HKCategoryValueSleepAnalysis.asleep.rawValue {
                            asleepSeconds += duration
                        }
                    }
                    inBedSeconds += duration
                }

                let asleepMinutes = Int(asleepSeconds / 60)
                let inBedMinutes = Int(inBedSeconds / 60)
                continuation.resume(returning: (asleepMinutes, inBedMinutes))
            }

            self.healthStore.execute(query)
        }
    }

    public func fetchWorkoutData(for date: Date) async throws -> [(title: String, durationMinutes: Int, calories: Int)] {
        guard HKHealthStore.isHealthDataAvailable() else { return [] }

        let calendar = Calendar.current
        let startOfDay = calendar.startOfDay(for: date)
        guard let endOfDay = calendar.date(byAdding: .day, value: 1, to: startOfDay) else { return [] }

        let predicate = HKQuery.predicateForSamples(withStart: startOfDay, end: endOfDay, options: .strictStartDate)

        return try await withCheckedThrowingContinuation { continuation in
            let query = HKSampleQuery(
                sampleType: .workoutType(),
                predicate: predicate,
                limit: 10,
                sortDescriptors: nil
            ) { _, samples, error in
                if let error = error {
                    continuation.resume(throwing: error)
                    return
                }

                guard let workouts = samples as? [HKWorkout] else {
                    continuation.resume(returning: [])
                    return
                }

                let results = workouts.map { workout -> (title: String, durationMinutes: Int, calories: Int) in
                    let title = workout.workoutActivityType == .running ? "Outdoor Run" : "Workout"
                    let duration = Int(workout.duration / 60)
                    let calories = Int(workout.totalEnergyBurned?.doubleValue(for: .kilocalorie()) ?? 0)
                    return (title, duration, calories)
                }

                continuation.resume(returning: results)
            }

            self.healthStore.execute(query)
        }
    }
}
