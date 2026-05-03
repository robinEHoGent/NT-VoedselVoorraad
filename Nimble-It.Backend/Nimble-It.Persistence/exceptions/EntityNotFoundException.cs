using System;

namespace Nimble_It.Persistence.exceptions
{
    public class EntityNotFoundException : Exception
    {
        public EntityNotFoundException(int? id = null, string? message = null)
            : base(
                message
                    ?? $"Entity with id '{(id.HasValue ? id.ToString() : "unknown")}' not found."
            ) { }
    }

    public class RecipeNotFoundException : EntityNotFoundException
    {
        public RecipeNotFoundException()
            : base() { }

        public RecipeNotFoundException(int id)
            : base(id: null, message: $"Recipe Entity '{id}' not found.") { }

        public RecipeNotFoundException(int id, string message)
            : base(id, message) { }
    }

    public class RecipeInfoNotFoundException : EntityNotFoundException
    {
        public RecipeInfoNotFoundException()
            : base() { }

        public RecipeInfoNotFoundException(int id)
            : base(id: null, message: $"RecipeInfo Entity '{id}' not found.") { }

        public RecipeInfoNotFoundException(int id, string message)
            : base(id, message) { }
    }

    public class DuplicateTagException : Exception
    {
        public DuplicateTagException(string tagName)
            : base($"Tag '{tagName}' already exists.") { }
    }

    public class ShoppingListNotFoundException : EntityNotFoundException
    {
        public ShoppingListNotFoundException()
            : base() { }

        public ShoppingListNotFoundException(int id)
            : base(id: null, message: $"ShoppingList Entity '{id}' not found.") { }

        public ShoppingListNotFoundException(int id, string message)
            : base(id, message) { }
    }

    public class ProductNotFoundException : EntityNotFoundException
    {
        public ProductNotFoundException()
            : base() { }

        public ProductNotFoundException(int id)
            : base(id: null, message: $"Product Entity '{id}' not found.") { }

        public ProductNotFoundException(int id, string message)
            : base(id, message) { }
    }
}
