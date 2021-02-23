import { useEffect, useState } from "react";
import { CatApi, CatPage } from "./api/CatApi";
import { AppHeader } from "./components/AppHeader";
import { CatGrid } from "./components/CatGrid";

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
      <AppHeader spacing={spacing} />

      {catPage &&
        <CatGrid
          catPage={catPage}
          onPageChange={fetchPage}
          spacing={spacing}
        />
      }
    </>
  );
}

export default App;
