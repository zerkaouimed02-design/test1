//
//  AscendApp.swift
//  Ascend - Life Progression System (iOS Native)
//
//  Main application entry point with SwiftData ModelContainer initialization.
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
            fatalError("Could not create ModelContainer: \(error)")
        }
    }()

    var body: some Scene {
        WindowGroup {
            MainTabView()
                .modelContainer(sharedModelContainer)
                .preferredColorScheme(.dark)
        }
    }
}
