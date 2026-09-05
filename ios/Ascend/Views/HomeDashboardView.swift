//
//  HomeDashboardView.swift
//  Ascend - Life Progression System (iOS Native)
//
//  Production SwiftUI Home Dashboard displaying 3 progression cards and Overall Level.
//

import SwiftUI
import SwiftData

struct HomeDashboardView: View {
    @Environment(\.modelContext) private var modelContext
    @Query private var users: [UserProfile]
    @Query(sort: \DailyRecord.dateString, order: .reverse) private var dailyRecords: [DailyRecord]
    @Query(sort: \SleepRecord.dateString, order: .reverse) private var sleepRecords: [SleepRecord]
    @Query(sort: \ExerciseSession.dateString, order: .reverse) private var exerciseSessions: [ExerciseSession]
    @Query(sort: \StudySession.dateString, order: .reverse) private var studySessions: [StudySession]

    @State private var showingCheckInSheet = false

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 20) {
                    // Overall Level Header Card
                    overallLevelCard

                    // 3 Fundamental Category Progression Cards
                    VStack(spacing: 16) {
                        sleepProgressionCard
                        exerciseProgressionCard
                        studyProgressionCard
                    }

                    // Today's Quick Metrics & Streaks
                    quickStatsSection
                }
                .padding(.horizontal, 16)
                .padding(.top, 12)
                .padding(.bottom, 32)
            }
            .background(Color(red: 0.05, green: 0.05, blue: 0.06).ignoresSafeArea())
            .navigationTitle("Ascend")
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button {
                        showingCheckInSheet = true
                    } label: {
                        Label("Check-In", systemImage: "sparkles")
                            .font(.system(size: 14, weight: .semibold))
                            .foregroundStyle(.indigo)
                    }
                }
            }
            .sheet(isPresented: $showingCheckInSheet) {
                Text("Daily Check-In Sheet")
                    .presentationDetents([.medium, .large])
            }
        }
    }

    private var overallLevelCard: some View {
        let totalXP = dailyRecords.reduce(0) { $0 + $1.totalXp }
        let eval = ProgressionEngine.shared.evaluateLevel(totalXP: totalXP)

        return VStack(alignment: .leading, spacing: 14) {
            HStack {
                VStack(alignment: .leading, spacing: 4) {
                    Text("OVERALL PROGRESSION")
                        .font(.system(size: 11, weight: .bold, design: .rounded))
                        .foregroundStyle(.secondary)
                        .tracking(1.2)
                    HStack(spacing: 8) {
                        Text("LEVEL \(eval.level)")
                            .font(.system(size: 26, weight: .heavy, design: .rounded))
                            .foregroundStyle(.white)
                        Text(eval.badge)
                            .font(.system(size: 22))
                    }
                }
                Spacer()
                VStack(alignment: .trailing, spacing: 2) {
                    Text("TODAY'S SCORE")
                        .font(.system(size: 10, weight: .semibold))
                        .foregroundStyle(.secondary)
                    Text("\(dailyRecords.first?.overallScore ?? 84)/100")
                        .font(.system(size: 20, weight: .bold, design: .rounded))
                        .foregroundStyle(.indigo)
                }
            }

            // Progress Bar
            VStack(spacing: 6) {
                GeometryReader { geo in
                    ZStack(alignment: .leading) {
                        Capsule()
                            .fill(Color.white.opacity(0.12))
                            .frame(height: 10)
                        Capsule()
                            .fill(LinearGradient(colors: [.indigo, .blue], startPoint: .leading, endPoint: .trailing))
                            .frame(width: max(0, min(geo.size.width, geo.size.width * CGFloat(eval.progressPercent / 100.0))), height: 10)
                    }
                }
                .frame(height: 10)

                HStack {
                    Text("\(eval.currentLevelXP) / \(eval.nextLevelXP) XP")
                        .font(.system(size: 12, weight: .medium))
                        .foregroundStyle(.secondary)
                    Spacer()
                    Text(eval.title)
                        .font(.system(size: 12, weight: .semibold))
                        .foregroundStyle(.white.opacity(0.85))
                }
            }
        }
        .padding(20)
        .background(
            RoundedRectangle(cornerRadius: 18, style: .continuous)
                .fill(Color(red: 0.11, green: 0.11, blue: 0.13))
                .overlay(
                    RoundedRectangle(cornerRadius: 18, style: .continuous)
                        .stroke(Color.white.opacity(0.08), lineWidth: 1)
                )
        )
    }

    private var sleepProgressionCard: some View {
        progressionCard(
            category: "SLEEP",
            icon: "moon.stars.fill",
            color: .indigo,
            level: 12,
            score: sleepRecords.first?.score ?? 84,
            streak: 7,
            metric1: ("Duration", "7h 25m"),
            metric2: ("Quality", "8.5 / 10")
        )
    }

    private var exerciseProgressionCard: some View {
        progressionCard(
            category: "EXERCISE",
            icon: "figure.run",
            color: .emeraldColor,
            level: 14,
            score: 91,
            streak: 5,
            metric1: ("Activity", "52 min"),
            metric2: ("Volume", "2,840 kg")
        )
    }

    private var studyProgressionCard: some View {
        progressionCard(
            category: "STUDY / WORK",
            icon: "brain.head.profile",
            color: .skyColor,
            level: 16,
            score: 87,
            streak: 8,
            metric1: ("Focus Time", "3h 15m"),
            metric2: ("Productivity", "9.1 / 10")
        )
    }

    private func progressionCard(
        category: String,
        icon: String,
        color: Color,
        level: Int,
        score: Int,
        streak: Int,
        metric1: (label: String, val: String),
        metric2: (label: String, val: String)
    ) -> some View {
        VStack(spacing: 14) {
            HStack {
                HStack(spacing: 10) {
                    Image(systemName: icon)
                        .font(.system(size: 16, weight: .bold))
                        .foregroundStyle(color)
                        .frame(width: 32, height: 32)
                        .background(color.opacity(0.15))
                        .clipShape(Circle())
                    VStack(alignment: .leading, spacing: 2) {
                        Text(category)
                            .font(.system(size: 12, weight: .bold, design: .rounded))
                            .foregroundStyle(.white)
                        Text("Level \(level)")
                            .font(.system(size: 11, weight: .medium))
                            .foregroundStyle(.secondary)
                    }
                }
                Spacer()
                HStack(spacing: 12) {
                    HStack(spacing: 4) {
                        Image(systemName: "flame.fill")
                            .font(.system(size: 12))
                            .foregroundStyle(.orange)
                        Text("\(streak)d")
                            .font(.system(size: 12, weight: .bold))
                            .foregroundStyle(.orange)
                    }
                    Text("\(score)/100")
                        .font(.system(size: 14, weight: .heavy, design: .rounded))
                        .foregroundStyle(.white)
                        .padding(.horizontal, 8)
                        .padding(.vertical, 4)
                        .background(Color.white.opacity(0.08))
                        .clipShape(Capsule())
                }
            }

            Divider().background(Color.white.opacity(0.08))

            HStack {
                VStack(alignment: .leading, spacing: 2) {
                    Text(metric1.label.uppercased())
                        .font(.system(size: 9, weight: .bold))
                        .foregroundStyle(.secondary)
                    Text(metric1.val)
                        .font(.system(size: 14, weight: .semibold))
                        .foregroundStyle(.white)
                }
                Spacer()
                VStack(alignment: .trailing, spacing: 2) {
                    Text(metric2.label.uppercased())
                        .font(.system(size: 9, weight: .bold))
                        .foregroundStyle(.secondary)
                    Text(metric2.val)
                        .font(.system(size: 14, weight: .semibold))
                        .foregroundStyle(.white)
                }
            }
        }
        .padding(16)
        .background(
            RoundedRectangle(cornerRadius: 16, style: .continuous)
                .fill(Color(red: 0.10, green: 0.10, blue: 0.12))
                .overlay(
                    RoundedRectangle(cornerRadius: 16, style: .continuous)
                        .stroke(Color.white.opacity(0.06), lineWidth: 1)
                )
        )
    }

    private var quickStatsSection: some View {
        HStack(spacing: 12) {
            statBox(label: "CURRENT STREAK", val: "7 Days", icon: "flame.fill", color: .orange)
            statBox(label: "WEEKLY GOAL", val: "88%", icon: "target", color: .blue)
            statBox(label: "BEST STREAK", val: "14 Days", icon: "trophy.fill", color: .yellow)
        }
    }

    private func statBox(label: String, val: String, icon: String, color: Color) -> some View {
        VStack(alignment: .leading, spacing: 6) {
            Image(systemName: icon)
                .font(.system(size: 14))
                .foregroundStyle(color)
            Text(val)
                .font(.system(size: 16, weight: .bold, design: .rounded))
                .foregroundStyle(.white)
            Text(label)
                .font(.system(size: 9, weight: .semibold))
                .foregroundStyle(.secondary)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(12)
        .background(
            RoundedRectangle(cornerRadius: 12, style: .continuous)
                .fill(Color(red: 0.10, green: 0.10, blue: 0.12))
        )
    }
}

extension Color {
    static let emeraldColor = Color(red: 0.1, green: 0.75, blue: 0.45)
    static let skyColor = Color(red: 0.15, green: 0.65, blue: 0.95)
}
