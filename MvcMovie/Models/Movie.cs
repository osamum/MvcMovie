using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using MvcMovie.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.OpenApi;
using Microsoft.AspNetCore.Http.HttpResults;

namespace MvcMovie.Models
{
    public class Movie
    {
        public int ID { get; set; }
        public string? Title { get; set; }

        [Display(Name = "Release Date")]
        [DataType(DataType.Date)]
        public DateTime ReleaseDate { get; set; }
        public string? Genre { get; set; }

        [Column(TypeName = "decimal(18, 2)")] 
        public decimal Price { get; set; }
        public string? Rating { get; set; }
    }


public static class MovieEndpoints
{
	public static void MapMovieEndpoints (this IEndpointRouteBuilder routes)
    {
        var group = routes.MapGroup("/api/Movie").WithTags(nameof(Movie));

        group.MapGet("/", async (MvcMovieContext db) =>
        {
            return await db.Movie.ToListAsync();
        })
        .WithName("GetAllMovies")
        .WithOpenApi();

        
        group.MapGet("/{id}", async Task<Results<Ok<Movie>, NotFound>> (int id, MvcMovieContext db) =>
        {
            return await db.Movie.AsNoTracking()
                .FirstOrDefaultAsync(model => model.ID == id)
                is Movie model
                    ? TypedResults.Ok(model)
                    : TypedResults.NotFound();
        })
        .WithName("GetMovieById")
        .WithOpenApi();
        

        group.MapGet("/find/{searchString}", async Task<Results<Ok<Movie>, NotFound>> (string searchString, MvcMovieContext db) =>
         {
            return await db.Movie.AsNoTracking()
            .FirstOrDefaultAsync(model => model.Title.Contains(searchString))
             is Movie model
             ? TypedResults.Ok(model)
             : TypedResults.NotFound();
             
         })
         .WithName("FindMovieName")
         .WithOpenApi();


        group.MapPut("/{id}", async Task<Results<Ok, NotFound>> (int id, Movie movie, MvcMovieContext db) =>
        {
            var affected = await db.Movie
                .Where(model => model.ID == id)
                .ExecuteUpdateAsync(setters => setters
                  .SetProperty(m => m.ID, movie.ID)
                  .SetProperty(m => m.Title, movie.Title)
                  .SetProperty(m => m.ReleaseDate, movie.ReleaseDate)
                  .SetProperty(m => m.Genre, movie.Genre)
                  .SetProperty(m => m.Price, movie.Price)
                  .SetProperty(m => m.Rating, movie.Rating)
                );

            return affected == 1 ? TypedResults.Ok() : TypedResults.NotFound();
        })
        .WithName("UpdateMovie")
        .WithOpenApi();

        group.MapPost("/", async (Movie movie, MvcMovieContext db) =>
        {
            db.Movie.Add(movie);
            await db.SaveChangesAsync();
            return TypedResults.Created($"/api/Movie/{movie.ID}",movie);
        })
        .WithName("CreateMovie")
        .WithOpenApi();

        group.MapDelete("/{id}", async Task<Results<Ok, NotFound>> (int id, MvcMovieContext db) =>
        {
            var affected = await db.Movie
                .Where(model => model.ID == id)
                .ExecuteDeleteAsync();

            return affected == 1 ? TypedResults.Ok() : TypedResults.NotFound();
        })
        .WithName("DeleteMovie")
        .WithOpenApi();
    }
}}
