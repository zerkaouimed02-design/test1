//
//  NotificationManager.swift
//  Ascend - Life Progression System (iOS Native)
//
//  UserNotifications management for bedtime, workouts, focus, and evening reviews.
//

import Foundation
import UserNotifications

public final class NotificationManager {
    public static let shared = NotificationManager()

    private init() {}

    public func requestAuthorization() async -> Bool {
        do {
            let granted = try await UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .sound, .badge])
            return granted
        } catch {
            return false
        }
    }

    public func scheduleBedtimeReminder(targetBedtime: String, minutesBefore: Int = 30) {
        let center = UNUserNotificationCenter.current()
        center.removePendingNotificationRequests(withIdentifiers: ["bedtime_reminder"])

        let parts = targetBedtime.split(separator: ":")
        guard parts.count == 2,
              let hour = Int(parts[0]),
              let minute = Int(parts[1]) else { return }

        var reminderMin = minute - minutesBefore
        var reminderHour = hour
        if reminderMin < 0 {
            reminderMin += 60
            reminderHour -= 1
            if reminderHour < 0 { reminderHour += 24 }
        }

        var dateComponents = DateComponents()
        dateComponents.hour = reminderHour
        dateComponents.minute = reminderMin

        let content = UNMutableNotificationContent()
        content.title = "Wind Down for Bedtime"
        content.body = "Your target bedtime is in \(minutesBefore) minutes. Disconnect from screens to protect sleep recovery."
        content.sound = .default

        let trigger = UNCalendarNotificationTrigger(dateMatching: dateComponents, repeats: true)
        let request = UNNotificationRequest(identifier: "bedtime_reminder", content: content, trigger: trigger)

        center.add(request)
    }

    public func scheduleEveningCheckIn(at timeString: String = "21:30") {
        let center = UNUserNotificationCenter.current()
        center.removePendingNotificationRequests(withIdentifiers: ["evening_checkin"])

        let parts = timeString.split(separator: ":")
        guard parts.count == 2,
              let hour = Int(parts[0]),
              let minute = Int(parts[1]) else { return }

        var dateComponents = DateComponents()
        dateComponents.hour = hour
        dateComponents.minute = minute

        let content = UNMutableNotificationContent()
        content.title = "Daily Evening Review"
        content.body = "Take 30 seconds to lock in today's XP and review your consistency streak."
        content.sound = .default

        let trigger = UNCalendarNotificationTrigger(dateMatching: dateComponents, repeats: true)
        let request = UNNotificationRequest(identifier: "evening_checkin", content: content, trigger: trigger)

        center.add(request)
    }
}
