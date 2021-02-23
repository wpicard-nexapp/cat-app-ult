import { Container, Typography, GridList, GridListTile } from "@material-ui/core";
import { Pagination } from "@material-ui/lab";
import { CatPage } from "../api/CatApi";

interface Props {
  catPage: CatPage;
  spacing: number;
  onPageChange: (page: number) => void;
}

export function CatGrid({ catPage, spacing, onPageChange }: Props) {
  return (
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
        onChange={(_, p) => onPageChange(p - 1)}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          margin: spacing
        }}
      />
    </Container>
  );
}