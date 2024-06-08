import clientPromise from "../../../lib/mongodb";

export default async function DocumentResults({ query }) {
  let movies: any = [];
  let mongodbQuery = query;

  try {
    const client = await clientPromise;
    client.connect();
    const db = client.db("sample_mflix");

    if (!mongodbQuery) {
      movies = await db
        .collection("movies")
        .find({})
        .sort({ metacritic: -1 })
        .limit(20)
        .toArray();
    } else {
      movies = await db
        .collection("movies")
        .find({})
        .sort({ metacritic: -1 })
        .limit(5)
        .toArray();
    }
  } catch (error) {
    movies = [];
    console.log("MongoDB not connecting");
  }

  return (
    <div>
      <ul>
        {movies.map((movie: any) => (
          <li key={movie._id}>
            <h2>Title: {movie.title}</h2>
            <h3>Metacritic: {movie.metacritic}</h3>
            <p>Plot: {movie.plot}</p>
            <br />
            <br />
          </li>
        ))}
      </ul>
    </div>
  );
}
