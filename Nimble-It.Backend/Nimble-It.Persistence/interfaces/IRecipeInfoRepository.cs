using Nimble_It.Persistence.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Nimble_It.Persistence.interfaces {
    public interface IRecipeInfoRepository {
        Task<List<RecipeInfo>> GetAllRecipeInfos();
        Task<RecipeInfo> GetRecipeInfo(int recipeInfoId);
        Task<List<RecipeInfo>> GetRecipeInfoByRecipeId(int recipeId);
        Task<RecipeInfo> CreateRecipeInfo(RecipeInfo recipeInfoEntity);
        Task<RecipeInfo> UpdateRecipeInfo(RecipeInfo recipeInfo);
        Task<bool> DeleteRecipeInfo(int recipeInfoId);
    }
}
