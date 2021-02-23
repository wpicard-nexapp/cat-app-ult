import { AppBar, Card, Container, GridList, GridListTile, Paper, Typography } from "@material-ui/core";
import { Pagination } from "@material-ui/lab";
import { useEffect, useState } from "react";
import { CatApi, CatPage } from "./api/CatApi";

const spacing = 7;

function App() {
  const [catPage, setCatPage] = useState<CatPage>();

  const fetchPage = (page: number) => {
    CatApi.getCatPage({
      limit: 12,
      page: page,
      order: "DESC",
      size: "thumb"
    })
      .then(setCatPage);
  }

  useEffect(() => {
    fetchPage(0);
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

      {catPage &&
        <Container>
          <Typography
            variant="h5"
            align="center"
            style={{
              margin: spacing
            }}
          >
            The ultimate cat application with {catPage.totalCatCount} cats to look at!
          </Typography>

          <GridList cols={4} spacing={spacing}>
            {catPage.cats.map(cat =>
              <GridListTile key={cat.id} cols={1}>
                <img src={cat.url} alt={cat.id} />
              </GridListTile>
            )}
          </GridList>
          <Pagination
            count={catPage.pageCount}
            page={catPage.currentPage + 1}
            onChange={(_, p) => fetchPage(p - 1)}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              margin: spacing
            }}
          />
        </Container>
      }
    </>
  );
}

export default App;
