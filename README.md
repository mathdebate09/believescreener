# BelieveScreener React Native (Android/iOS)

A React Native app for Android and iOS, built for [believescreener.com](https://believescreener.com) — part of the [believe.app](https://believe.app) project
> Bounty for [CrackedDevs@SuperteamEarn](https://earn.superteam.fun/listing/build-react-native-mobile-app/)

## Previews

### Demo Video

[believescreener-bounty-demo @ veed.io](https://www.veed.io/view/e378e461-80bf-4fee-b0fe-a52577a5f72f?panel=share)

### Mockups

<table>
  <tr>
    <td><img src="https://github.com/user-attachments/assets/25761b03-6393-41a5-b24b-00d1b931c7fd" width="250"/></td>
    <td><img src="https://github.com/user-attachments/assets/b8c06254-e24d-472e-acd8-72b666f7cf57" width="250"/></td>
    <td><img src="https://github.com/user-attachments/assets/6a44c957-52d5-4ae5-9175-16b96f26bb4a" width="250"/></td>
    <td><img src="https://github.com/user-attachments/assets/f596d71d-754e-4e7e-8172-891a99aa12f7" width="250"/></td>
    <td><img src="https://github.com/user-attachments/assets/9a3d77b2-9180-48cb-9f23-d8634de37eb8" width="250"/></td>
  </tr>
  <tr>
    <td><img src="https://github.com/user-attachments/assets/1a1d0c81-3eeb-4412-828c-9b1ac60669b8" width="250"/></td>
    <td><img src="https://github.com/user-attachments/assets/2d5aab5c-4c47-46fe-917a-efe3a5ffbc84" width="250"/></td>
    <td><img src="https://github.com/user-attachments/assets/2e04c8a0-ef02-43e5-947d-afe332aa5c5d" width="250"/></td>
    <td><img src="https://github.com/user-attachments/assets/22f56bd3-e11a-41b3-8f8d-f39b261df7b6" width="250"/></td>
    <td><img src="https://github.com/user-attachments/assets/575dcfef-b118-47ba-a19a-f30ef612247b" width="250"/></td>
  </tr>
</table>

## Tech Stack

[![React Native](https://img.shields.io/badge/react_native-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)](https://reactnative.dev/docs/getting-started)
[![Expo](https://img.shields.io/badge/expo-1C1E24?style=for-the-badge&logo=expo&logoColor=#D04A37)](https://docs.expo.dev/)
[![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/docs/)
[![Nativeflow](https://img.shields.io/badge/Nativeflow-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)](https://nativeflow.js.org/docs/intro)

## Approach

### How did I fetch the list of Believe Tokens?

I've mocked the list of tokens at [believe-dummy-app](https://github.com/mathdebate09/believeapp-dummy) ([deployed-link](https://believeapp-dummy.vercel.app/)), which gets the data of tokens from the [believe.app/explore](https://believe.app/api/tokens/explore) & the metrics dashboard is updated manually

### External APIs

- [Dexscreener API](https://docs.dexscreener.com/api/reference) for token prices
- [Moralis API](https://docs.moralis.com/web3-data-api/solana/reference/get-token-top-holders?network=mainnet&address=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v&limit=100) for token holder list
- [Helius API](https://www.helius.dev/docs/api-reference/das/getassetsbyowner) for portfolio of an address

> All necessary API keys have been mentioned in `.env.template`

## Get started

- Make sure you have [Node 20.xx.x](https://nodejs.org/en/download/package-manager) or higher and [Git](https://git-scm.com/downloads) downloaded

1. Clone the repository
   ```bash
   git clone git@github.com:mathdebate09/believescreener.git
   cd believescreener
   ```
1. Install dependencies

   ```bash
   npm install
   ```

1. Start the app

   ```bash
   npm run start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo
