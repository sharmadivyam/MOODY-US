'use client';

import axios from 'axios';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

// Define the structure of the data fetched from the server
interface GenreData {
  genre: string;
  counter: number;
}

const FavoriteGenres = () => {
  const movieGenres: string[] = [
    'Action',
    'Comedy',
    'Drama',
    'Sci-Fi',
    'Horror',
    'Romance',
    'Adventure',
    'Fantasy',
    'Mystery',
    'Thriller'
  ];

  const songGenres: string[] = [
    'Pop',
    'Rock',
    'Hip-Hop',
    'Jazz',
    'Classical',
    'Country',
    'Electronic',
    'Blues',
    'R&B',
    'Reggae'
  ];

  // Define the type for the data state
  const [data, setData] = useState<GenreData[]>([]);

  useEffect(() => {
    axios.get<GenreData[]>("http://localhost:8080/")
      .then(res => setData(res.data))
      .catch(err => console.log(err));
  }, []);

  // Handle genre selection for movies
  const handleSubmit = (genre: string) => {
    console.log(genre);
    axios.put(`http://localhost:8080/update/${genre}`)
      .then(res => {
        console.log(res);
        location.reload();
      })
      .catch(err => console.log(err));
  };

  // Handle genre selection for songs
  const handleSubmit1 = (genre: string) => {
    console.log(genre);
    axios.put(`http://localhost:8080/update/songs/${genre}`)
      .then(res => {
        console.log(res);
        location.reload();
      })
      .catch(err => console.log(err));
  };

  return (
    <div className="flex justify-center items-center flex-wrap m-5 gap-10">
      {/* Movie genres section */}
      {movieGenres.map((genre) => (
        <div key={genre} className="flex flex-col h-40 w-40 items-center justify-center gap-10 border-2 border-black bg-amber-400 pl-2">
          <span>{genre}</span>
          <div className="space-x-2 ">
            <Button
              type="button"
              className={`px-2 py-1 rounded-none w-full`}
              onClick={() => handleSubmit(genre)}
            >
              Like
            </Button>
          </div>
        </div>
      ))}
<Link href="mood">
<Button>Next</Button>
</Link>
     
    </div>
  );
};

export default FavoriteGenres;
