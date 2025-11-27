import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { User } from "../../features/auth/user.model";
import { Movie } from "../../features/movies/movie.model";
import { Theater } from "../../features/movie-details/theater.model";
import { Showtime } from "../../features/movie-details/showtime.model";
import { Watchlist } from "../../features/watchlist/watchlist.model";

// Sample movies data (50 actual movies)
const moviesData = [
	{
		title: "The Shawshank Redemption",
		description:
			"Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
		poster: "https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NmNlLWJiNDMtZDViZWM2MzIxZDYwXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_SX300.jpg",
		genres: ["Drama"],
		mpaaRating: "R",
		rating: 4.9,
		releaseYear: 1994,
		duration: 142,
		cast: ["Tim Robbins", "Morgan Freeman", "Bob Gunton"],
		director: "Frank Darabont",
		trailerUrl: "https://www.youtube.com/watch?v=6hB3S9bIaco",
	},
	{
		title: "The Godfather",
		description: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
		poster: "https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg",
		genres: ["Crime", "Drama"],
		mpaaRating: "R",
		rating: 4.9,
		releaseYear: 1972,
		duration: 175,
		cast: ["Marlon Brando", "Al Pacino", "James Caan"],
		director: "Francis Ford Coppola",
		trailerUrl: "https://www.youtube.com/watch?v=sY1S34973zA",
	},
	{
		title: "The Dark Knight",
		description:
			"When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
		poster: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_SX300.jpg",
		genres: ["Action", "Crime", "Drama"],
		mpaaRating: "PG-13",
		rating: 4.9,
		releaseYear: 2008,
		duration: 152,
		cast: ["Christian Bale", "Heath Ledger", "Aaron Eckhart"],
		director: "Christopher Nolan",
		trailerUrl: "https://www.youtube.com/watch?v=EXeTwQWrcwY",
	},
	{
		title: "Pulp Fiction",
		description: "The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.",
		poster: "https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg",
		genres: ["Crime", "Drama"],
		mpaaRating: "R",
		rating: 4.8,
		releaseYear: 1994,
		duration: 154,
		cast: ["John Travolta", "Uma Thurman", "Samuel L. Jackson"],
		director: "Quentin Tarantino",
		trailerUrl: "https://www.youtube.com/watch?v=s7EdQ4FqbhY",
	},
	{
		title: "Schindler's List",
		description:
			"In German-occupied Poland during World War II, industrialist Oskar Schindler gradually becomes concerned for his Jewish workforce after witnessing their persecution by the Nazis.",
		poster: "https://m.media-amazon.com/images/M/MV5BNDE4OTMxMTctNmRhYy00NWE2LTg3YzItYTk3M2UwOTU5Njg4XkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
		genres: ["Biography", "Drama", "History"],
		mpaaRating: "R",
		rating: 4.8,
		releaseYear: 1993,
		duration: 195,
		cast: ["Liam Neeson", "Ralph Fiennes", "Ben Kingsley"],
		director: "Steven Spielberg",
		trailerUrl: "https://www.youtube.com/watch?v=gG22XNhtnoY",
	},
	{
		title: "Forrest Gump",
		description:
			"The presidencies of Kennedy and Johnson, the Vietnam War, the Watergate scandal and other historical events unfold from the perspective of an Alabama man with an IQ of 75.",
		poster: "https://m.media-amazon.com/images/M/MV5BNWIwODRlZTUtY2U3ZS00Yzg1LWJhNzYtMmZiYmEyNmU1NjMzXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
		genres: ["Drama", "Romance"],
		mpaaRating: "PG-13",
		rating: 4.8,
		releaseYear: 1994,
		duration: 142,
		cast: ["Tom Hanks", "Robin Wright", "Gary Sinise"],
		director: "Robert Zemeckis",
		trailerUrl: "https://www.youtube.com/watch?v=bLvqoHBptjg",
	},
	{
		title: "Inception",
		description:
			"A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
		poster: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
		genres: ["Action", "Sci-Fi", "Thriller"],
		mpaaRating: "PG-13",
		rating: 4.8,
		releaseYear: 2010,
		duration: 148,
		cast: ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Elliot Page"],
		director: "Christopher Nolan",
		trailerUrl: "https://www.youtube.com/watch?v=YoHD9XEInc0",
	},
	{
		title: "Fight Club",
		description:
			"An insomniac office worker and a devil-may-care soap maker form an underground fight club that evolves into much more.",
		poster: "https://m.media-amazon.com/images/M/MV5BNDIzNDU0YzEtYzE5Ni00ZjlkLTk5ZjgtNjM3NWE4YzA3Nzk3XkEyXkFqcGdeQXVyMjUzOTY1NTc@._V1_SX300.jpg",
		genres: ["Drama"],
		mpaaRating: "R",
		rating: 4.7,
		releaseYear: 1999,
		duration: 139,
		cast: ["Brad Pitt", "Edward Norton", "Helena Bonham Carter"],
		director: "David Fincher",
		trailerUrl: "https://www.youtube.com/watch?v=qtRKdVHc-cE",
	},
	{
		title: "The Matrix",
		description:
			"When a beautiful stranger leads computer hacker Neo to a forbidding underworld, he discovers the shocking truth--the life he knows is the elaborate deception of an evil cyber-intelligence.",
		poster: "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
		genres: ["Action", "Sci-Fi"],
		mpaaRating: "R",
		rating: 4.7,
		releaseYear: 1999,
		duration: 136,
		cast: ["Keanu Reeves", "Laurence Fishburne", "Carrie-Anne Moss"],
		director: "Lana Wachowski, Lilly Wachowski",
		trailerUrl: "https://www.youtube.com/watch?v=vKQi3bBA1y8",
	},
	{
		title: "Goodfellas",
		description:
			"The story of Henry Hill and his life in the mob, covering his relationship with his wife Karen Hill and his mob partners Jimmy Conway and Tommy DeVito.",
		poster: "https://image.tmdb.org/t/p/w500/aKuFiU82s5ISJpGZp7YkIr3kCUd.jpg",
		genres: ["Biography", "Crime", "Drama"],
		mpaaRating: "R",
		rating: 4.7,
		releaseYear: 1990,
		duration: 145,
		cast: ["Robert De Niro", "Ray Liotta", "Joe Pesci"],
		director: "Martin Scorsese",
		trailerUrl: "https://www.youtube.com/watch?v=2ilzidi_J8Q",
	},
	{
		title: "Interstellar",
		description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
		poster: "https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg",
		genres: ["Adventure", "Drama", "Sci-Fi"],
		mpaaRating: "PG-13",
		rating: 4.6,
		releaseYear: 2014,
		duration: 169,
		cast: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain"],
		director: "Christopher Nolan",
		trailerUrl: "https://www.youtube.com/watch?v=zSWdZVtXT7E",
	},
	{
		title: "The Lord of the Rings: The Return of the King",
		description:
			"Gandalf and Aragorn lead the World of Men against Sauron's army to draw his gaze from Frodo and Sam as they approach Mount Doom with the One Ring.",
		poster: "https://m.media-amazon.com/images/M/MV5BNzA5ZDNlZWMtM2NhNS00NDJjLTk4NDItYTRmY2EwMWZlMTY3XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg",
		genres: ["Action", "Adventure", "Drama"],
		mpaaRating: "PG-13",
		rating: 4.8,
		releaseYear: 2003,
		duration: 201,
		cast: ["Elijah Wood", "Viggo Mortensen", "Ian McKellen"],
		director: "Peter Jackson",
		trailerUrl: "https://www.youtube.com/watch?v=r5X-hFf6Bwo",
	},
	{
		title: "Gladiator",
		description:
			"A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family and sent him into slavery.",
		poster: "https://m.media-amazon.com/images/M/MV5BMDliMmNhNDEtODUyOS00MjNlLTgxODEtN2U3NzIxMGVkZTA1L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
		genres: ["Action", "Adventure", "Drama"],
		mpaaRating: "R",
		rating: 4.6,
		releaseYear: 2000,
		duration: 155,
		cast: ["Russell Crowe", "Joaquin Phoenix", "Connie Nielsen"],
		director: "Ridley Scott",
		trailerUrl: "https://www.youtube.com/watch?v=owK1qxDselE",
	},
	{
		title: "The Silence of the Lambs",
		description:
			"A young F.B.I. cadet must receive the help of an incarcerated and manipulative cannibal killer to help catch another serial killer.",
		poster: "https://m.media-amazon.com/images/M/MV5BNjNhZTk0ZmEtNjJhMi00YzFlLWE1MmEtYzM1M2ZmMGMwMTU4XkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
		genres: ["Crime", "Drama", "Thriller"],
		mpaaRating: "R",
		rating: 4.7,
		releaseYear: 1991,
		duration: 118,
		cast: ["Jodie Foster", "Anthony Hopkins", "Lawrence A. Bonney"],
		director: "Jonathan Demme",
		trailerUrl: "https://www.youtube.com/watch?v=W6Mm8Sbe__o",
	},
	{
		title: "Saving Private Ryan",
		description:
			"Following the Normandy Landings, a group of U.S. soldiers go behind enemy lines to retrieve a paratrooper whose brothers have been killed in action.",
		poster: "https://m.media-amazon.com/images/M/MV5BZjhkMDM4MWItZTVjOC00ZDRhLThmYTAtM2I5NzBmNmNlMzI1XkEyXkFqcGdeQXVyNDYyMDk5MTU@._V1_SX300.jpg",
		genres: ["Drama", "War"],
		mpaaRating: "R",
		rating: 4.7,
		releaseYear: 1998,
		duration: 169,
		cast: ["Tom Hanks", "Matt Damon", "Tom Sizemore"],
		director: "Steven Spielberg",
		trailerUrl: "https://www.youtube.com/watch?v=zwhP5b4tD6g",
	},
	{
		title: "The Green Mile",
		description:
			"The lives of guards on Death Row are affected by one of their charges: a black man accused of child murder and rape, yet who has a mysterious gift.",
		poster: "https://m.media-amazon.com/images/M/MV5BMTUxMzQyNjA5MF5BMl5BanBnXkFtZTYwOTU2NTY3._V1_SX300.jpg",
		genres: ["Crime", "Drama", "Fantasy"],
		mpaaRating: "R",
		rating: 4.6,
		releaseYear: 1999,
		duration: 189,
		cast: ["Tom Hanks", "Michael Clarke Duncan", "David Morse"],
		director: "Frank Darabont",
		trailerUrl: "https://www.youtube.com/watch?v=Ki4haFrqSrw",
	},
	{
		title: "Star Wars: Episode V - The Empire Strikes Back",
		description:
			"After the Rebels are brutally overpowered by the Empire on the ice planet Hoth, Luke Skywalker begins Jedi training with Yoda, while his friends are pursued across the galaxy by Darth Vader.",
		poster: "https://m.media-amazon.com/images/M/MV5BYmU1NDRjNDgtMzhiMi00NjZmLTg5NGItZDNiZjU5NTU4OTE0XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg",
		genres: ["Action", "Adventure", "Fantasy"],
		mpaaRating: "PG",
		rating: 4.7,
		releaseYear: 1980,
		duration: 124,
		cast: ["Mark Hamill", "Harrison Ford", "Carrie Fisher"],
		director: "Irvin Kershner",
		trailerUrl: "https://www.youtube.com/watch?v=JNwNXF9Y6kY",
	},
	{
		title: "Parasite",
		description:
			"Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.",
		poster: "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
		genres: ["Drama", "Thriller"],
		mpaaRating: "R",
		rating: 4.6,
		releaseYear: 2019,
		duration: 132,
		cast: ["Kang-ho Song", "Sun-kyun Lee", "Yeo-jeong Jo"],
		director: "Bong Joon Ho",
		trailerUrl: "https://www.youtube.com/watch?v=5xH0HfJHsaY",
	},
	{
		title: "The Lion King",
		description: "Lion prince Simba and his father are targeted by his bitter uncle, who wants to ascend the throne himself.",
		poster: "https://m.media-amazon.com/images/M/MV5BYTYxNGMyZTYtMjE3MS00MzNjLWFjNmYtMDk3N2FmM2JiM2M1XkEyXkFqcGdeQXVyNjY5NDU4NzI@._V1_SX300.jpg",
		genres: ["Animation", "Adventure", "Drama"],
		mpaaRating: "G",
		rating: 4.5,
		releaseYear: 1994,
		duration: 88,
		cast: ["Matthew Broderick", "Jeremy Irons", "James Earl Jones"],
		director: "Roger Allers, Rob Minkoff",
		trailerUrl: "https://www.youtube.com/watch?v=lFzVJEksoDY",
	},
	{
		title: "Back to the Future",
		description:
			"Marty McFly, a 17-year-old high school student, is accidentally sent 30 years into the past in a time-traveling DeLorean invented by his close friend.",
		poster: "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
		genres: ["Adventure", "Comedy", "Sci-Fi"],
		mpaaRating: "PG",
		rating: 4.6,
		releaseYear: 1985,
		duration: 116,
		cast: ["Michael J. Fox", "Christopher Lloyd", "Lea Thompson"],
		director: "Robert Zemeckis",
		trailerUrl: "https://www.youtube.com/watch?v=qvsgGtivCgs",
	},
	// Continuing with 30 more movies...
	{
		title: "The Departed",
		description:
			"An undercover cop and a mole in the police attempt to identify each other while infiltrating an Irish gang in South Boston.",
		poster: "https://m.media-amazon.com/images/M/MV5BMTI1MTY2OTIxNV5BMl5BanBnXkFtZTYwNjQ4NjY3._V1_SX300.jpg",
		genres: ["Crime", "Drama", "Thriller"],
		mpaaRating: "R",
		rating: 4.5,
		releaseYear: 2006,
		duration: 151,
		cast: ["Leonardo DiCaprio", "Matt Damon", "Jack Nicholson"],
		director: "Martin Scorsese",
		trailerUrl: "https://www.youtube.com/watch?v=SGWvwjZ0eDc",
	},
	{
		title: "Whiplash",
		description:
			"A promising young drummer enrolls at a cut-throat music conservatory where his dreams of greatness are mentored by an instructor who will stop at nothing to realize a student's potential.",
		poster: "https://m.media-amazon.com/images/M/MV5BOTA5NDZlZGUtMjAxOS00YTRkLTkwYmMtYWQ0NWEwZDZiNjEzXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg",
		genres: ["Drama", "Music"],
		mpaaRating: "R",
		rating: 4.5,
		releaseYear: 2014,
		duration: 106,
		cast: ["Miles Teller", "J.K. Simmons", "Paul Reiser"],
		director: "Damien Chazelle",
		trailerUrl: "https://www.youtube.com/watch?v=7d_jQycdQGo",
	},
	{
		title: "The Prestige",
		description:
			"After a tragic accident, two stage magicians engage in a battle to create the ultimate illusion while sacrificing everything they have to outwit each other.",
		poster: "https://m.media-amazon.com/images/M/MV5BMjA4NDI0MTIxNF5BMl5BanBnXkFtZTYwNTM0MzY2._V1_SX300.jpg",
		genres: ["Drama", "Mystery", "Sci-Fi"],
		mpaaRating: "PG-13",
		rating: 4.5,
		releaseYear: 2006,
		duration: 130,
		cast: ["Christian Bale", "Hugh Jackman", "Scarlett Johansson"],
		director: "Christopher Nolan",
		trailerUrl: "https://www.youtube.com/watch?v=o4gHCmTQDVI",
	},
	{
		title: "The Usual Suspects",
		description:
			"A sole survivor tells of the twisty events leading up to a horrific gun battle on a boat, which began when five criminals met at a seemingly random police lineup.",
		poster: "https://m.media-amazon.com/images/M/MV5BYTViNjMyNmUtNDFkNC00ZDRlLThmMDUtZDU2YWE4NGI2ZjVmXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
		genres: ["Crime", "Drama", "Mystery"],
		mpaaRating: "R",
		rating: 4.6,
		releaseYear: 1995,
		duration: 106,
		cast: ["Kevin Spacey", "Gabriel Byrne", "Chazz Palminteri"],
		director: "Bryan Singer",
		trailerUrl: "https://www.youtube.com/watch?v=oiXdPolca5w",
	},
	{
		title: "The Lion King",
		description:
			"After the murder of his father, a young lion prince flees his kingdom only to learn the true meaning of responsibility and bravery.",
		poster: "https://m.media-amazon.com/images/M/MV5BYTYxNGMyZTYtMjE3MS00MzNjLWFjNmYtMDk3N2FmM2JiM2M1XkEyXkFqcGdeQXVyNjY5NDU4NzI@._V1_SX300.jpg",
		genres: ["Animation", "Adventure", "Drama"],
		mpaaRating: "G",
		rating: 4.5,
		releaseYear: 1994,
		duration: 88,
		cast: ["Matthew Broderick", "Jeremy Irons", "James Earl Jones"],
		director: "Roger Allers, Rob Minkoff",
		trailerUrl: "https://www.youtube.com/watch?v=lFzVJEksoDY",
	},
	{
		title: "Casablanca",
		description:
			"A cynical expatriate American cafe owner struggles to decide whether or not to help his former lover and her fugitive husband escape the Nazis in French Morocco.",
		poster: "https://m.media-amazon.com/images/M/MV5BY2IzZGY2YmEtYzljNS00NTM5LTgwMzUtMzM1NjQ4NGI0OTk0XkEyXkFqcGdeQXVyNDYyMDk5MTU@._V1_SX300.jpg",
		genres: ["Drama", "Romance", "War"],
		mpaaRating: "PG",
		rating: 4.5,
		releaseYear: 1942,
		duration: 102,
		cast: ["Humphrey Bogart", "Ingrid Bergman", "Paul Henreid"],
		director: "Michael Curtiz",
		trailerUrl: "https://www.youtube.com/watch?v=BkL9l7qovsE",
	},
	{
		title: "American History X",
		description: "A former neo-nazi skinhead tries to prevent his younger brother from going down the same wrong path that he did.",
		poster: "https://image.tmdb.org/t/p/w500/euypWkaYFOLW3e5rLIcTAjWnhhT.jpg",
		genres: ["Crime", "Drama"],
		mpaaRating: "R",
		rating: 4.5,
		releaseYear: 1998,
		duration: 119,
		cast: ["Edward Norton", "Edward Furlong", "Beverly D'Angelo"],
		director: "Tony Kaye",
		trailerUrl: "https://www.youtube.com/watch?v=JsPW6Fj3GUQ",
	},
	{
		title: "Spirited Away",
		description:
			"During her family's move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits, and where humans are changed into beasts.",
		poster: "https://m.media-amazon.com/images/M/MV5BMjlmZmI5MDctNDE2YS00YWE0LWE5ZWItZDBhYWQ0NTcxNWRhXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg",
		genres: ["Animation", "Adventure", "Family"],
		mpaaRating: "PG",
		rating: 4.6,
		releaseYear: 2001,
		duration: 125,
		cast: ["Daveigh Chase", "Suzanne Pleshette", "Miyu Irino"],
		director: "Hayao Miyazaki",
		trailerUrl: "https://www.youtube.com/watch?v=ByXuk9QqQkk",
	},
	{
		title: "Modern Times",
		description: "The Tramp struggles to live in modern industrial society with the help of a young homeless woman.",
		poster: "https://m.media-amazon.com/images/M/MV5BYjJiZjMzYzktNjU0NS00OTkxLWEwYzItYzdhYWJjN2QzMTRlL2ltYWdlL2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
		genres: ["Comedy", "Drama", "Family"],
		mpaaRating: "G",
		rating: 4.5,
		releaseYear: 1936,
		duration: 87,
		cast: ["Charles Chaplin", "Paulette Goddard", "Henry Bergman"],
		director: "Charles Chaplin",
		trailerUrl: "https://www.youtube.com/watch?v=HAPilyrEzC4",
	},
	{
		title: "City Lights",
		description:
			"With the aid of a wealthy erratic tippler, a dewy-eyed tramp who has fallen in love with a sightless flower girl accumulates money to be able to help her medically.",
		poster: "https://m.media-amazon.com/images/M/MV5BY2I4MmM1N2EtM2YzOS00OWUzLTkzYzctNDc5NDg2N2IyODJmXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg",
		genres: ["Comedy", "Drama", "Romance"],
		mpaaRating: "G",
		rating: 4.5,
		releaseYear: 1931,
		duration: 87,
		cast: ["Charles Chaplin", "Virginia Cherrill", "Florence Lee"],
		director: "Charles Chaplin",
		trailerUrl: "https://www.youtube.com/watch?v=GkrRRiuGf5I",
	},
	{
		title: "Intouchables",
		description:
			"After he becomes a quadriplegic from a paragliding accident, an aristocrat hires a young man from the projects to be his caregiver.",
		poster: "https://m.media-amazon.com/images/M/MV5BMTYxNDA3MDQwNl5BMl5BanBnXkFtZTcwNTU4Mzc1Nw@@._V1_SX300.jpg",
		genres: ["Biography", "Comedy", "Drama"],
		mpaaRating: "R",
		rating: 4.5,
		releaseYear: 2011,
		duration: 112,
		cast: ["François Cluzet", "Omar Sy", "Anne Le Ny"],
		director: "Olivier Nakache, Éric Toledano",
		trailerUrl: "https://www.youtube.com/watch?v=34WIbmXkewU",
	},
	{
		title: "Once Upon a Time in the West",
		description:
			"A mysterious stranger with a harmonica joins forces with a notorious desperado to protect a beautiful widow from a ruthless assassin working for the railroad.",
		poster: "https://m.media-amazon.com/images/M/MV5BODQ3NDExOGYtMzI3Mi00NWRlLTkwNjAtNjc4MDgzZGJiZTA1XkEyXkFqcGdeQXVyMjUzOTY1NTc@._V1_SX300.jpg",
		genres: ["Western"],
		mpaaRating: "PG-13",
		rating: 4.5,
		releaseYear: 1968,
		duration: 165,
		cast: ["Henry Fonda", "Charles Bronson", "Claudia Cardinale"],
		director: "Sergio Leone",
		trailerUrl: "https://www.youtube.com/watch?v=c8CJ6L0I6W8",
	},
	{
		title: "Grave of the Fireflies",
		description: "A young boy and his little sister struggle to survive in Japan during World War II.",
		poster: "https://m.media-amazon.com/images/M/MV5BZmY2NjUzNDQtNTgxNC00M2Q4LTljOWQtMjNjNDBjNWUxNmJlXkEyXkFqcGdeQXVyNTA4NzY1MzY@._V1_SX300.jpg",
		genres: ["Animation", "Drama", "War"],
		mpaaRating: "NR",
		rating: 4.5,
		releaseYear: 1988,
		duration: 89,
		cast: ["Tsutomu Tatsumi", "Ayano Shiraishi", "Akemi Yamaguchi"],
		director: "Isao Takahata",
		trailerUrl: "https://www.youtube.com/watch?v=4vPeTSRd580",
	},
	{
		title: "Psycho",
		description:
			"A Phoenix secretary embezzles $40,000 from her employer's client, goes on the run, and checks into a remote motel run by a young man under the domination of his mother.",
		poster: "https://m.media-amazon.com/images/M/MV5BNTQwNDM1YzItNDAxZC00NWY2LTk0M2UtNDIwNWI5OGUyNWUxXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg",
		genres: ["Horror", "Mystery", "Thriller"],
		mpaaRating: "R",
		rating: 4.5,
		releaseYear: 1960,
		duration: 109,
		cast: ["Anthony Perkins", "Janet Leigh", "Vera Miles"],
		director: "Alfred Hitchcock",
		trailerUrl: "https://www.youtube.com/watch?v=Wz719b9QUqY",
	},
	{
		title: "Rear Window",
		description:
			"A wheelchair-bound photographer spies on his neighbors from his apartment window and becomes convinced one of them has committed murder.",
		poster: "https://m.media-amazon.com/images/M/MV5BNGUxYWM3M2MtMGM3Mi00ZmRiLWE0NGQtZjE5ODI2OTJhNTU0XkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
		genres: ["Mystery", "Thriller"],
		mpaaRating: "PG",
		rating: 4.5,
		releaseYear: 1954,
		duration: 112,
		cast: ["James Stewart", "Grace Kelly", "Wendell Corey"],
		director: "Alfred Hitchcock",
		trailerUrl: "https://www.youtube.com/watch?v=i_VJrO5_E8o",
	},
	{
		title: "Alien",
		description:
			"After a space merchant vessel receives an unknown transmission as a distress call, one of the crew is attacked by a mysterious life form and they soon realize that its life cycle has merely begun.",
		poster: "https://m.media-amazon.com/images/M/MV5BOGQzZTBjMjQtOTVmMS00NGE5LWEyYmMtOGQ1ZGZjNmRkYjFhXkEyXkFqcGdeQXVyMjUzOTY1NTc@._V1_SX300.jpg",
		genres: ["Horror", "Sci-Fi"],
		mpaaRating: "R",
		rating: 4.5,
		releaseYear: 1979,
		duration: 117,
		cast: ["Sigourney Weaver", "Tom Skerritt", "John Hurt"],
		director: "Ridley Scott",
		trailerUrl: "https://www.youtube.com/watch?v=LjLamj-b0I8",
	},
	{
		title: "Apocalypse Now",
		description:
			"A U.S. Army officer serving in Vietnam is tasked with assassinating a renegade Special Forces Colonel who sees himself as a god.",
		poster: "https://image.tmdb.org/t/p/w500/gQB8Y5RCMkv2zwzFHbUJX3kAhvA.jpg",
		genres: ["Drama", "Mystery", "War"],
		mpaaRating: "R",
		rating: 4.4,
		releaseYear: 1979,
		duration: 147,
		cast: ["Martin Sheen", "Marlon Brando", "Robert Duvall"],
		director: "Francis Ford Coppola",
		trailerUrl: "https://www.youtube.com/watch?v=FTjG-Aux_yc",
	},
	{
		title: "Memento",
		description: "A man with short-term memory loss attempts to track down his wife's murderer.",
		poster: "https://m.media-amazon.com/images/M/MV5BZTcyNjk1MjgtOWI3Mi00YzQwLWI5MTktMzY4ZmI2NDAyNzYzXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
		genres: ["Mystery", "Thriller"],
		mpaaRating: "R",
		rating: 4.4,
		releaseYear: 2000,
		duration: 113,
		cast: ["Guy Pearce", "Carrie-Anne Moss", "Joe Pantoliano"],
		director: "Christopher Nolan",
		trailerUrl: "https://www.youtube.com/watch?v=4CV41hoyS8A",
	},
	{
		title: "The Great Dictator",
		description:
			"Dictator Adenoid Hynkel tries to expand his empire while a poor Jewish barber tries to avoid persecution from Hynkel's regime.",
		poster: "https://m.media-amazon.com/images/M/MV5BMmExYWJjNTktNGUyZS00ODhmLTkxYzAtNWIzOGEyMGNiMmUwXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
		genres: ["Comedy", "Drama", "War"],
		mpaaRating: "G",
		rating: 4.4,
		releaseYear: 1940,
		duration: 125,
		cast: ["Charles Chaplin", "Paulette Goddard", "Jack Oakie"],
		director: "Charles Chaplin",
		trailerUrl: "https://www.youtube.com/watch?v=k8bVG8XC-4I",
	},
	{
		title: "The Lives of Others",
		description:
			"In 1984 East Berlin, an agent of the secret police, conducting surveillance on a writer and his lover, finds himself becoming increasingly absorbed by their lives.",
		poster: "https://m.media-amazon.com/images/M/MV5BNmQyNmJjM2ItNTQzYi00ZjMxLWFjMDYtZjUyN2YwZDk5YWQ2XkEyXkFqcGdeQXVyMjUzOTY1NTc@._V1_SX300.jpg",
		genres: ["Drama", "Mystery", "Thriller"],
		mpaaRating: "R",
		rating: 4.4,
		releaseYear: 2006,
		duration: 137,
		cast: ["Ulrich Mühe", "Martina Gedeck", "Sebastian Koch"],
		director: "Florian Henckel von Donnersmarck",
		trailerUrl: "https://www.youtube.com/watch?v=n3_iLOp6IhM",
	},
	{
		title: "Django Unchained",
		description:
			"With the help of a German bounty hunter, a freed slave sets out to rescue his wife from a brutal Mississippi plantation owner.",
		poster: "https://m.media-amazon.com/images/M/MV5BMjIyNTQ5NjQ1OV5BMl5BanBnXkFtZTcwODg1MDU4OA@@._V1_SX300.jpg",
		genres: ["Drama", "Western"],
		mpaaRating: "R",
		rating: 4.4,
		releaseYear: 2012,
		duration: 165,
		cast: ["Jamie Foxx", "Christoph Waltz", "Leonardo DiCaprio"],
		director: "Quentin Tarantino",
		trailerUrl: "https://www.youtube.com/watch?v=_iH0UBYDI4g",
	},
	{
		title: "WALL·E",
		description:
			"In the distant future, a small waste-collecting robot inadvertently embarks on a space journey that will ultimately decide the fate of mankind.",
		poster: "https://m.media-amazon.com/images/M/MV5BMjExMTg5OTU0NF5BMl5BanBnXkFtZTcwMjMxMzMzMw@@._V1_SX300.jpg",
		genres: ["Animation", "Adventure", "Family"],
		mpaaRating: "G",
		rating: 4.4,
		releaseYear: 2008,
		duration: 98,
		cast: ["Ben Burtt", "Elissa Knight", "Jeff Garlin"],
		director: "Andrew Stanton",
		trailerUrl: "https://www.youtube.com/watch?v=CZ1CATNbXg0",
	},
	{
		title: "Paths of Glory",
		description:
			"After refusing to attack an enemy position, a general accuses the soldiers of cowardice and their commanding officer must defend them.",
		poster: "https://m.media-amazon.com/images/M/MV5BOTI5Nzc0OTMtYzBkMS00NjkxLThmM2UtNjM2ODgxN2M5NjNkXkEyXkFqcGdeQXVyNjQ2MjQ5NzM@._V1_SX300.jpg",
		genres: ["Drama", "War"],
		mpaaRating: "NR",
		rating: 4.4,
		releaseYear: 1957,
		duration: 88,
		cast: ["Kirk Douglas", "Ralph Meeker", "Adolphe Menjou"],
		director: "Stanley Kubrick",
		trailerUrl: "https://www.youtube.com/watch?v=nmDA00V_QYk",
	},
	{
		title: "Avengers: Infinity War",
		description:
			"The Avengers and their allies must be willing to sacrifice all in an attempt to defeat the powerful Thanos before his blitz of devastation and ruin puts an end to the universe.",
		poster: "https://m.media-amazon.com/images/M/MV5BMjMxNjY2MDU1OV5BMl5BanBnXkFtZTgwNzY1MTUwNTM@._V1_SX300.jpg",
		genres: ["Action", "Adventure", "Sci-Fi"],
		mpaaRating: "PG-13",
		rating: 4.4,
		releaseYear: 2018,
		duration: 149,
		cast: ["Robert Downey Jr.", "Chris Hemsworth", "Mark Ruffalo"],
		director: "Anthony Russo, Joe Russo",
		trailerUrl: "https://www.youtube.com/watch?v=6ZfuNTqbHE8",
	},
	{
		title: "The Shining",
		description:
			"A family heads to an isolated hotel for the winter where a sinister presence influences the father into violence, while his psychic son sees horrific forebodings from both past and future.",
		poster: "https://m.media-amazon.com/images/M/MV5BZWFlYmY2MGEtZjVkYS00YzU4LTg0YjQtYzY1ZGE3NTA5NGQxXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
		genres: ["Drama", "Horror"],
		mpaaRating: "R",
		rating: 4.4,
		releaseYear: 1980,
		duration: 146,
		cast: ["Jack Nicholson", "Shelley Duvall", "Danny Lloyd"],
		director: "Stanley Kubrick",
		trailerUrl: "https://www.youtube.com/watch?v=5Cb3ik6zP2I",
	},
	{
		title: "Witness for the Prosecution",
		description: "A veteran British barrister must defend his client in a murder trial that has surprise after surprise.",
		poster: "https://m.media-amazon.com/images/M/MV5BNDQwODU5OWYtNDcyNi00MDQ1LThiOGMtZDkwNWJiM2Y3MDg0XkEyXkFqcGdeQXVyMDI2NDg0NQ@@._V1_SX300.jpg",
		genres: ["Crime", "Drama", "Mystery"],
		mpaaRating: "NR",
		rating: 4.4,
		releaseYear: 1957,
		duration: 116,
		cast: ["Tyrone Power", "Marlene Dietrich", "Charles Laughton"],
		director: "Billy Wilder",
		trailerUrl: "https://www.youtube.com/watch?v=K4g9oZMTDJg",
	},
	{
		title: "The Pianist",
		description: "A Polish Jewish musician struggles to survive the destruction of the Warsaw ghetto of World War II.",
		poster: "https://m.media-amazon.com/images/M/MV5BOWRiZDIxZjktMTA1NC00MDQ2LWEzMjUtMTliZmY3NjQ3ODJiXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
		genres: ["Biography", "Drama", "Music"],
		mpaaRating: "R",
		rating: 4.5,
		releaseYear: 2002,
		duration: 150,
		cast: ["Adrien Brody", "Thomas Kretschmann", "Frank Finlay"],
		director: "Roman Polanski",
		trailerUrl: "https://www.youtube.com/watch?v=BFwGqLa_oAo",
	},
	{
		title: "Terminator 2: Judgment Day",
		description:
			"A cyborg, identical to the one who failed to kill Sarah Connor, must now protect her teenage son, John Connor, from a more advanced and powerful cyborg.",
		poster: "https://m.media-amazon.com/images/M/MV5BMGU2NzRmZjUtOGUxYS00ZjdjLWEwZWItY2NlM2JhNjkxNTFmXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
		genres: ["Action", "Sci-Fi"],
		mpaaRating: "R",
		rating: 4.5,
		releaseYear: 1991,
		duration: 137,
		cast: ["Arnold Schwarzenegger", "Linda Hamilton", "Edward Furlong"],
		director: "James Cameron",
		trailerUrl: "https://www.youtube.com/watch?v=CRRlbK5w8AE",
	},
	{
		title: "Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb",
		description:
			"An insane American general orders a bombing attack on the Soviet Union, triggering a path to nuclear holocaust that a war room full of politicians and generals frantically tries to stop.",
		poster: "https://m.media-amazon.com/images/M/MV5BZWI3ZTMxNjctMjdlNS00NmUwLWFiM2YtZDUyY2I3N2MxYTE0XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg",
		genres: ["Comedy", "War"],
		mpaaRating: "PG",
		rating: 4.4,
		releaseYear: 1964,
		duration: 95,
		cast: ["Peter Sellers", "George C. Scott", "Sterling Hayden"],
		director: "Stanley Kubrick",
		trailerUrl: "https://www.youtube.com/watch?v=1gXY3kuDvSU",
	},
	{
		title: "Oldboy",
		description:
			"After being kidnapped and imprisoned for fifteen years, Oh Dae-Su is released, only to find that he must find his captor in five days.",
		poster: "https://m.media-amazon.com/images/M/MV5BMTI3NTQyMzU5M15BMl5BanBnXkFtZTcwMTM2MjgyMQ@@._V1_SX300.jpg",
		genres: ["Action", "Drama", "Mystery"],
		mpaaRating: "R",
		rating: 4.3,
		releaseYear: 2003,
		duration: 120,
		cast: ["Choi Min-sik", "Yoo Ji-tae", "Kang Hye-jeong"],
		director: "Park Chan-wook",
		trailerUrl: "https://www.youtube.com/watch?v=2HkjrJ6IK5E",
	},
];

// Sample theaters data
const theatersData = [
	{
		name: "AMC Downtown 12",
		address: "123 Main Street",
		city: "Los Angeles",
		state: "CA",
		zipCode: "90012",
		distance: 0.5,
	},
	{
		name: "Regal Cinemas LA Live",
		address: "1000 W Olympic Blvd",
		city: "Los Angeles",
		state: "CA",
		zipCode: "90015",
		distance: 1.2,
	},
	{
		name: "Cinemark Century City",
		address: "10250 Santa Monica Blvd",
		city: "Los Angeles",
		state: "CA",
		zipCode: "90067",
		distance: 2.5,
	},
	{
		name: "ArcLight Hollywood",
		address: "6360 Sunset Blvd",
		city: "Los Angeles",
		state: "CA",
		zipCode: "90028",
		distance: 3.8,
	},
	{
		name: "iPic Theaters Westwood",
		address: "10840 Wilshire Blvd",
		city: "Los Angeles",
		state: "CA",
		zipCode: "90024",
		distance: 4.1,
	},
];

export async function seedDatabase() {
	try {
		console.log("Starting database seeding...");

		// Clear existing data
		await Promise.all([
			User.deleteMany({}),
			Movie.deleteMany({}),
			Theater.deleteMany({}),
			Showtime.deleteMany({}),
			Watchlist.deleteMany({}),
		]);
		console.log("Cleared existing data");

		// Create sample user
		const hashedPassword = await bcrypt.hash("password123", 10);
		const user = await User.create({
			email: "test@example.com",
			password: hashedPassword,
			name: "Test User",
		});
		console.log("Created sample user:", user.email);

		// Create movies
		const movies = await Movie.insertMany(moviesData);
		console.log(`Created ${movies.length} movies`);

		// Create theaters
		const theaters = await Theater.insertMany(theatersData);
		console.log(`Created ${theaters.length} theaters`);

		// Create showtimes for each movie and theater
		const showtimes = [];
		const times = ["10:00", "13:30", "16:00", "19:30", "22:00"];
		const today = new Date();
		const dates = [
			new Date(today),
			new Date(today.getTime() + 86400000), // +1 day
			new Date(today.getTime() + 172800000), // +2 days
		];

		for (const movie of movies.slice(0, 20)) {
			// Only first 20 movies get showtimes
			for (const theater of theaters) {
				for (const date of dates) {
					for (const time of times) {
						showtimes.push({
							movieId: movie._id,
							theaterId: theater._id,
							date,
							time,
						});
					}
				}
			}
		}

		await Showtime.insertMany(showtimes);
		console.log(`Created ${showtimes.length} showtimes`);

		// Add some movies to user's watchlist
		const watchlistMovies = movies.slice(0, 5);
		const watchlistItems = watchlistMovies.map((movie) => ({
			userId: user._id,
			movieId: movie._id,
		}));
		await Watchlist.insertMany(watchlistItems);
		console.log(`Added ${watchlistItems.length} movies to watchlist`);

		console.log("Database seeding completed successfully!");
		console.log("\nSample credentials:");
		console.log("Email: test@example.com");
		console.log("Password: password123");
	} catch (error) {
		console.error("Error seeding database:", error);
		throw error;
	}
}
