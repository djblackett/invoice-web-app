import "styled-components";
import { lightTheme } from "./features/shared/styles/Themes";

type AppTheme = typeof lightTheme;

declare module "styled-components" {
  export interface DefaultTheme extends AppTheme {
    // Legacy optional tokens are absent from both themes; preserve their fallbacks.
    primaryText?: string;
    cardBorder?: string;
    buttonBackground?: string;
  }
}
