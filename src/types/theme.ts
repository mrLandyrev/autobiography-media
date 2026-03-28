export type Theme = {
    colors: {
        primary: string,
        secondary: string,
        default: string,
    }
}

export const DefaultTheme: Theme = {
  colors: {
        primary: "#b42222",
        secondary: "#47dc47ff",
        default: "rgba(32, 32, 32, 0.89)",
  }
}