import { NavBar } from "./navbar";
import { AlertCircle, Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { useState } from "react";
import { AnimeTheme, parseAnimeThemes } from "@/lib/utils";
// import { XMLParserComponent } from "./xml-parser";
import SearchBar from "./search-bar";

function MainLayout() {
  const [openingsData, setOpeningsData] = useState<AnimeTheme[]>([]);
  const [endingsData, setEndingsData] = useState<AnimeTheme[]>([]);
  const [animeName, setAnimeName] = useState<string>("");
  const [animeId, setAnimeId] = useState<number>(0);
  const [animeImageURL, setAnimeImageURL] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [found, setFound] = useState<boolean>(false);
  const [errorString, setErrorString] = useState<string>("");

  const clearState = () => {
    setFound(false);
    setOpeningsData([]);
    setEndingsData([]);
    setAnimeName("");
    setAnimeId(0);
    setAnimeImageURL("");
    setErrorString("");
    setLoading(false);
  };

  const getMusicData = (animeId: string | number) => {
    clearState();
    setLoading(true);
    fetch(`https://api.jikan.moe/v4/anime/${animeId}/full`)
      .then((res) => {
        if (res.ok) return res.json();
        else {
          return Promise.reject(res.statusText);
        }
      })
      .then((res) => {
        setAnimeName(res.data.title);
        setAnimeId(res.data.mal_id);
        setAnimeImageURL(res.data.images.jpg.large_image_url);
        const { parsedOpenings, parsedEndings } = parseAnimeThemes(
          res.data.theme
        );
        setOpeningsData(parsedOpenings);
        setEndingsData(parsedEndings);
        setFound(true);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setErrorString(error);
        setFound(false);
        setLoading(false);
      });
  };

  return (
    <main className="w-full min-h-screen">
      <NavBar />
      <div className="mx-auto my-0">
        <h1 className="text-6xl my-5">Animusic</h1>
        <p className="my-10">
          This is a small project for searching (and in the future listening,
          hopefully) anime opening and ending themes
        </p>
        <div className="grid mx-auto my-2 w-full max-w-md items-center gap-2">
          <Label htmlFor="animeId">
            Search your anime here (Can use MyAnimeList's IDs):
          </Label>
          <SearchBar getMusicData={getMusicData} />
          {errorString && (
            <Alert
              variant="destructive"
              className="text-left border-destructive"
            >
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{errorString}</AlertDescription>
            </Alert>
          )}
        </div>
        {loading && (
          <div className="min-w-x">
            <Loader2 className="animate-spin mx-auto my-0" />
          </div>
        )}
        <div className="flex flex-row flex-wrap mx-auto my-2 w-full max-w-2xl items-center justify-center gap-3">
          {found && (
            <>
              <div className="min-w-xl">
                <p>{animeName}</p>
                <a
                  href={`https://myanimelist.net/anime/${animeId}`}
                  target="_blank"
                >
                  <img
                    className="inline"
                    src={animeImageURL}
                    alt={animeName}
                    width={240}
                    height={240}
                  />
                </a>
              </div>
              {openingsData.length === 0 && (
                <div className="min-w-xl">
                  <h3>No Opening Themes Data</h3>
                </div>
              )}
              {openingsData.length > 0 && (
                <div className="min-w-xl">
                  <h3>Opening Themes</h3>
                  {openingsData.map((op) => (
                    <p
                      key={`${op.name}-${op.artist}`}
                      className="py-1"
                    >{`${op.name} by ${op.artist} (eps ${op.episodes})`}</p>
                  ))}
                </div>
              )}
              {endingsData.length === 0 && (
                <div className="min-w-xl">
                  <h3>No Ending Themes Data</h3>
                </div>
              )}
              {endingsData.length > 0 && (
                <div className="min-w-xl ">
                  <h3>Ending Themes</h3>
                  {endingsData.map((ed) => (
                    <p
                      key={`${ed.name}-${ed.artist}`}
                      className="py-1"
                    >{`${ed.name} by ${ed.artist} (eps ${ed.episodes})`}</p>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
        {/* <XMLParserComponent /> */}
      </div>
    </main>
  );
}

export default MainLayout;
