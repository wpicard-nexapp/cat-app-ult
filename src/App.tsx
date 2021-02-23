import { AppBar, Container, GridList, GridListTile, Typography } from "@material-ui/core";
import { useEffect, useState } from "react";
import { CatApi, CatPage } from "./api/CatApi";

const spacing = 5;

function App() {
  const [page, setPage] = useState<CatPage>();

  useEffect(() => {
    CatApi.getCatPage({
      limit: 12,
      page: 0,
      size: "thumb"
    })
      .then(setPage);
  }, []);

  return (
    <>
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

      {page &&
        <Container>
          <GridList cols={4} spacing={spacing}>
            {page.cats.map(cat =>
              <GridListTile key={cat.id} cols={1}>
                <img src={cat.url} alt={cat.id} />
              </GridListTile>
            )}
          </GridList>
          
        </Container>
      }
    </>
  );
}

export default App;
