import { AppBar, Typography } from "@material-ui/core";

interface Props {
  spacing: number;
}

export function AppHeader({ spacing }: Props) {
  return (
    <AppBar
      position="sticky"
      style={{
        padding: spacing,
        marginBottom: spacing
      }}
    >
      <Typography variant="h1" align="center">
        Cat-App-Ult
      </Typography>
    </AppBar>
  );
}