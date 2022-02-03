using System;
using System.Linq;
using System.Data.SqlClient;
using System.Data;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using System.Net.Http;
using System.Net.Http.Headers;
using NW = Newtonsoft.Json;
using MS = System.Text.Json;
using System.Collections.Generic;
using System.Diagnostics;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

class Program
{
    static async Task Main(string[] args)
    {
        TimeSpan Tiempo = new TimeSpan(0, 0, 240);
        while (true)
        {
            await Temporizador();
            Thread.Sleep(Tiempo);
        }
    }
    static async Task Temporizador()
    {
        Console.WriteLine("------------------------------------------------------------------------------------------");

        //Cogemos el JSON de euskalmet
        var requestUrl = $"https://www.euskalmet.euskadi.eus/vamet/stations/stationList/stationList.json";

        Debug.WriteLine(requestUrl);
        var client = new HttpClient { BaseAddress = new Uri(requestUrl) };
        var responseMessage = await client.GetAsync("", HttpCompletionOption.ResponseContentRead);
        var resultData = await responseMessage.Content.ReadAsStringAsync();
        dynamic stationTypeJson = JsonConvert.DeserializeObject(resultData);

        //Recorre todas las Balizas que hemos recogido en el JSON
        foreach (var Balizas in stationTypeJson)
        {
            try
            {
                //Cogemos la fecha actual y añadimos 0 si es menor de 10
                DateTime Date = DateTime.Now;
                var sday = "";
                var smonth = "";
                if (Date.Day < 10)
                    sday = 0 + "" + Date.Day;
                else
                    sday = Convert.ToString(Date.Day);

                if (Date.Month < 10)
                    smonth = 0 + "" + Date.Month;
                else
                    smonth = Convert.ToString(Date.Month);

                //Declaramos las variables de los datos
                var temperatura = "Sin datos";
                var precipitacion = "Sin datos";
                var humedad = "Sin datos";
                var viento = "Sin datos";
                Console.WriteLine(Balizas.id);
                //Añadimos a la URL el id de la baliza y la fecha actual
                var cliente = new HttpClient { BaseAddress = new Uri($"https://www.euskalmet.euskadi.eus/vamet/stations/readings/{Balizas.id}/{Date.Year}/{smonth}/{sday}/readingsData.json") };
                var responseMessagee = await cliente.GetAsync("", HttpCompletionOption.ResponseContentRead);
                var resultDatae = await responseMessagee.Content.ReadAsStringAsync();
                dynamic stationReadingsJson = JsonConvert.DeserializeObject(resultDatae);

                //Obtenemos los datos existentes de las balizas
                foreach (var DatosBalizas in stationReadingsJson)
                {
                    //Recorremos el objeto del numero de las balizas
                    foreach (JObject numero in DatosBalizas)
                    {
                        try
                        {
                            //Cogemos el name(""temperatura, humerdad...) de la baliza
                            String dataType = numero["name"].ToString();
                            //Cogemos el objeto que guarda los datos
                            JObject preDataJson = JObject.Parse(numero["data"].ToString());
                            //Obtenemos las llaves y los valores
                            IList<string> keys = preDataJson.Properties().Select(p => p.Name).ToList();
                            JObject dataJson = JObject.Parse(preDataJson[keys[0]].ToString());


                            //Creamos un switch
                            switch (dataType)
                            {
                                case "temperature":
                                    //Ordenan los valores obtenidos
                                    List<string> dataJsonTimeList = dataJson.Properties().Select(p => p.Name).ToList();
                                    dataJsonTimeList.Sort();
                                    //Cogemos el ultimo valor
                                    temperatura = Convert.ToString(dataJson[dataJsonTimeList.Last()]);
                                    break;
                                case "precipitation":
                                    //Ordenan los valores obtenidos
                                    List<string> dataJsonPreciList = dataJson.Properties().Select(p => p.Name).ToList();
                                    dataJsonPreciList.Sort();
                                    //Cogemos el ultimo valor
                                    precipitacion = Convert.ToString(dataJson[dataJsonPreciList.Last()]);
                                    break;
                                case "humidity":
                                    //Ordenan los valores obtenidos
                                    List<string> dataJsonHumiList = dataJson.Properties().Select(p => p.Name).ToList();
                                    dataJsonHumiList.Sort();
                                    //Cogemos el ultimo valor
                                    humedad = Convert.ToString(dataJson[dataJsonHumiList.Last()]);
                                    break;
                                case "mean_speed":
                                    //Ordenan los valores obtenidos
                                    List<string> dataJsonWindList = dataJson.Properties().Select(p => p.Name).ToList();
                                    dataJsonWindList.Sort();
                                    //Cogemos el ultimo valor
                                    viento = Convert.ToString(dataJson[dataJsonWindList.Last()]);
                                    break;
                            }
                        }
                        catch (Exception e)
                        {
                            Console.WriteLine("Error");
                        }
                    }
                }
                using (var db = new TiempoContext())
                {
                    try
                    {
                        //Condicion para evitar las tuplas sin datos
                        if (temperatura == "Sin datos" && precipitacion == "Sin datos" && humedad == "Sin datos" && viento == "Sin datos")
                        {
                        }
                        else if(Balizas.province=="Navarra" || Balizas.province=="Burgos"){
                        }
                        else
                        {
                            string id = Balizas.id;
                            try
                            {
                                //Actualizamos 
                                Console.WriteLine("Actualizando");
                                var tupla = db.TiempoData.Where(a => a.Id == id).Single();
                                tupla.Temperatura = temperatura;
                                tupla.Humedad = humedad;
                                tupla.Viento = viento;
                                tupla.Precipitacion = precipitacion;
                            }
                            catch (Exception e)
                            {
                                Console.WriteLine("Añadiendo");
                                var a1 = new TiempoData { Id = Balizas.id, Nombre = Balizas.name, Municipio = Balizas.municipality, Provincia = Balizas.province, Temperatura = temperatura, Humedad = humedad, Viento = viento, Precipitacion = precipitacion, GpxX = Balizas.x, GpxY = Balizas.y, TipoEstacion = Balizas.stationType };
                                db.TiempoData.Add(a1);
                            }
                        }
                        db.SaveChanges();
                        Console.WriteLine("Guardado");
                    }
                    catch (Exception e)
                    {
                        Console.WriteLine("Error al guardar");
                    }
                }
            }
            catch (Exception e)
            {
                Console.WriteLine("Error al buscar un datos");
            }
        }
    }
}