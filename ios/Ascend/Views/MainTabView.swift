//
//  MainTabView.swift
//  Ascend - Life Progression System (iOS Native)
//
//  Production SwiftUI 5-tab navigation architecture.
//

import SwiftUI
import SwiftData

struct MainTabView: View {
    @State private var selectedTab: Tab = .home

    enum Tab: String, CaseIterable, Identifiable {
        case home = "Home"
        case progress = "Progress"
        case track = "Track"
        case insights = "Insights"
        case profile = "Profile"

        var id: String { rawValue }

        var iconName: String {
            switch self {
            case .home: return "house.fill"
            case .progress: return "trophy.fill"
            case .track: return "plus.circle.fill"
            case .insights: return "chart.xyaxis.line"
            case .profile: return "person.crop.circle"
            }
        }
    }

    var body: some View {
        TabView(selection: $selectedTab) {
            HomeDashboardView()
                .tabItem {
                    Label(Tab.home.rawValue, systemImage: Tab.home.iconName)
                }
                .tag(Tab.home)

            NavigationStack {
                ProgressionLadderSwiftUIView()
            }
            .tabItem {
                Label(Tab.progress.rawValue, systemImage: Tab.progress.iconName)
            }
            .tag(Tab.progress)

            NavigationStack {
                TrackingSwiftUIView()
            }
            .tabItem {
                Label(Tab.track.rawValue, systemImage: Tab.track.iconName)
            }
            .tag(Tab.track)

            NavigationStack {
                InsightsSwiftUIView()
            }
            .tabItem {
                Label(Tab.insights.rawValue, systemImage: Tab.insights.iconName)
            }
            .tag(Tab.insights)

            NavigationStack {
                ProfileSwiftUIView()
            }
            .tabItem {
                Label(Tab.profile.rawValue, systemImage: Tab.profile.iconName)
            }
            .tag(Tab.profile)
        }
        .tint(.indigo)
    }
}

// Placeholder helper SwiftUI views for native Xcode target compilation
struct ProgressionLadderSwiftUIView: View {
    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 16) {
                Text("Progression Ladder")
                    .font(.title2.bold())
                    .foregroundStyle(.white)
                Text("Levels 1 to 100 with milestone titles and XP requirements.")
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
            }
            .padding()
        }
        .background(Color(red: 0.05, green: 0.05, blue: 0.06).ignoresSafeArea())
        .navigationTitle("Progress")
    }
}

struct TrackingSwiftUIView: View {
    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 16) {
                Text("Track Pillars")
                    .font(.title2.bold())
                    .foregroundStyle(.white)
                Text("Sleep session, workouts with PRs, projects, and focus timer.")
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
            }
            .padding()
        }
        .background(Color(red: 0.05, green: 0.05, blue: 0.06).ignoresSafeArea())
        .navigationTitle("Track")
    }
}

struct InsightsSwiftUIView: View {
    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 16) {
                Text("Analytics & Causality")
                    .font(.title2.bold())
                    .foregroundStyle(.white)
                Text("Correlations, trend charts, weekly and monthly reviews.")
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
            }
            .padding()
        }
        .background(Color(red: 0.05, green: 0.05, blue: 0.06).ignoresSafeArea())
        .navigationTitle("Insights")
    }
}

struct ProfileSwiftUIView: View {
    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 16) {
                Text("Profile & Settings")
                    .font(.title2.bold())
                    .foregroundStyle(.white)
                Text("Circadian targets, workouts cadence, HealthKit, notifications, and export.")
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
            }
            .padding()
        }
        .background(Color(red: 0.05, green: 0.05, blue: 0.06).ignoresSafeArea())
        .navigationTitle("Profile")
    }
}
