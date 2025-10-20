# Connectify - Mobile Chat Application (React Native)

**Connectify Mobile** is the cross-platform mobile client for the Connectify real-time messaging application, built with **React Native** and **Expo**. It connects to the same MERN stack backend as the web application, offering a seamless chat experience on iOS and Android devices.

*Note: The backend and web frontend for this application are in a separate repository: [Connectify Web](https://github.com/SridharPlays/Connectify).*

![Project Status](https://img.shields.io/badge/status-active-brightgreen)

## ✨ Features

* **Real-Time Messaging**: Instant one-on-one message delivery and updates using **Socket.io**.
* **Cross-Platform**: Built with **React Native & Expo** for iOS and Android.
* **User Authentication**: Secure signup, login, and session management using JWT.
* **Dynamic Theming**: Choose from **32 distinct themes** inspired by daisyUI. Your preference is saved locally and applied across the app.
* **Profile Management**: View and update your profile information, including uploading a custom profile picture via the device gallery.
* **Online Status**: See which users are currently online in real-time.
* **Message Deletion**: Soft-delete your own messages, which appear as "This message was deleted".
* **Native Look & Feel**: A clean interface optimized for mobile devices.

## 🛠️ Tech Stack

| Category   | Technology                                                                                                    |
| :----------- | :------------------------------------------------------------------------------------------------------------ |
| **Frontend** | React Native, Expo, Expo Router, Zustand (for state management), Axios, `lucide-react-native`, `react-safe-area` |
| **Storage** | `expo-secure-store`, `@react-native-async-storage/async-storage`                                              |
| **Backend** | Connects to the MERN backend (Node.js, Express.js, Socket.io, MongoDB)                                        |

## 🚀 Getting Started

Follow these instructions to get the mobile app running on your local machine or device for development.

### Prerequisites

* Node.js (v18.x or higher)
* npm or yarn
* Expo Go app installed on your physical device (iOS or Android) or an emulator/simulator set up.
* The backend server from the [Connectify Web](https://github.com/SridharPlays/Connectify) repository must be running locally.

### Installation & Setup

1. **Clone the repository:**

    ```sh
    git clone https://github.com/SridharPlays/Connectify-Mobile.git
    cd Connectify-Mobile
    ```

2. **Install dependencies:**

    ```sh
    npm install
    ```

3. **Set up Environment Variables:**
    * Create a `.env` file in the root of the project.
    * Find your computer's local network IP address (e.g., run `ipconfig` on Windows or `ifconfig` on macOS/Linux).
    * Add the following lines to your `.env` file, replacing `<YOUR_COMPUTER_IP>` with your actual IP:

        ```env
        EXPO_PUBLIC_API_URL=http://<YOUR_COMPUTER_IP>:5001
        EXPO_PUBLIC_SOCKET_URL=http://<YOUR_COMPUTER_IP>:5001
        ```

4. **Run the application:**

    ```sh
    npx expo start
    ```

    * Scan the QR code with the Expo Go app on your phone, or press `a` or `i` to launch on an Android emulator or iOS simulator.

---

## 🏗️ Building the App (APK/AAB)

This project uses EAS (Expo Application Services) to build installable app packages.

1. **Install EAS CLI:**

    ```sh
    npm install -g eas-cli
    ```

2. **Login and Configure:**

    ```sh
    eas login
    eas build:configure
    ```

3. **Set Production Secrets:**
    Before building, set your production backend URLs as EAS environment variables (Secrets).

    ```sh
    # Replace the URL with your actual deployed backend URL
    eas env:create --scope project --name EXPO_PUBLIC_API_URL --value <YOUR_PRODUCTION_URL> --visibility sensitive
    eas env:create --scope project --name EXPO_PUBLIC_SOCKET_URL --value <YOUR_PRODUCTION_URL> --visibility sensitive
    ```

4. **Start the Build:**
    * For an APK (direct installation/testing):

        ```sh
        eas build --platform android --profile preview
        ```

    * For an AAB (Google Play Store):

        ```sh
        eas build --platform android --profile production
        ```

## 🔮 Future Updates

* Implement image sending in messages.
* Add push notifications.
* Refine UI/UX based on user feedback.
