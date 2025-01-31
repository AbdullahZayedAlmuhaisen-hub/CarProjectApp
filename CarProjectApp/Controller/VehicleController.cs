using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using System.Net.Http;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

[Route("api/[controller]")]
[ApiController]
public class VehicleController : ControllerBase
{
    private readonly HttpClient _httpClient;

    public VehicleController(IHttpClientFactory httpClientFactory)
    {
        _httpClient = httpClientFactory.CreateClient();
    }

    [HttpGet("getAllMakes")]
    public async Task<IActionResult> GetAllMakes()
    {
        try
        {
            var response = await _httpClient.GetStringAsync("https://vpic.nhtsa.dot.gov/api/vehicles/getallmakes?format=json");
            var result = JsonSerializer.Deserialize<Makes>(response);
            return Ok(response);
        }
        catch (Exception ex) {
            throw;
        
        }
      
    }

    [HttpGet("getVehicleTypes/{makeId}")]
    public async Task<IActionResult> GetVehicleTypes(int makeId)
    {
        var response = await _httpClient.GetStringAsync($"https://vpic.nhtsa.dot.gov/api/vehicles/GetVehicleTypesForMakeId/{makeId}?format=json");
        var result = JsonSerializer.Deserialize<Makes>(response);
        return Ok(result.Results);
    }

    [HttpGet("getModels/{makeId}/{year}")]
    public async Task<IActionResult> GetModels(int makeId, int year)
    {
        try
        {
            var response = await _httpClient.GetStringAsync($"https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeIdYear/makeId/{makeId}/modelyear/{year}?format=json");
        var result = JsonSerializer.Deserialize<Makes>(response);
        return Ok(result.Results);
        }
        catch (Exception ex)
        {
            throw;

        }
    }


    public class Makes
    {
        [JsonPropertyName("Results")]
        public List<Vehicle> Results { get; set; }

    }
      
    public class Vehicle
    {
        [JsonPropertyName("Make_ID")]
        public int MakeId { get; set; }

        [JsonPropertyName("Make_Name")]
        public string MakeName { get; set; } 
        
        [JsonPropertyName("Model_Name")]
        public string ModelName { get; set; }  
        
        [JsonPropertyName("Model_ID")]
        public int ModelID { get; set; } 
 
        [JsonPropertyName("VehicleTypeName")]
        public string VehicleTypeName { get; set; }
        [JsonPropertyName("VehicleTypeId")]
        public int VehicleTypeId { get; set; }
    }
}