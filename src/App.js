import { useEffect, useState } from 'react';
import './App.css';
import LoaderPage from './Loader/LoaderPage';
import Nutrition from './Nutrition';

function App() {


  const [search, setSearch] = useState('');
  const [wordSubmitted, setWordSubmitted] = useState('');
  const [nutritionResult, setNutritionResult] = useState('');
  const [loader, setLoader] = useState(false);
  const MY_ID = "f0ecfb58";
  const MY_KEY = "a22f2af6a46c0bb7b7974f5381e47222";
  const API_URL = "https://api.edamam.com/api/nutrition-details";



  const recipeSearchResult = e => {
    setSearch(e.target.value)
  }


  const finalSearch = e => {
    e.preventDefault()
    setWordSubmitted(search)
    console.log(search)
  }

  useEffect(() => {
    if (wordSubmitted !== '') {
      let ingr = wordSubmitted.split(/[,,;,\n,\r]/);
      fetchData(ingr)
    }
  }, [wordSubmitted])


  const fetchData = async (ingr) => {
    setLoader(true);

    const response = await fetch(`${API_URL}?app_id=${MY_ID}&app_key=${MY_KEY}`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({ ingr: ingr })
    })


    if (response.ok) {
      setLoader(false)
      const data = await response.json()
      setNutritionResult(data)
    } else {
      setLoader(false)
      alert('Please, enter ingredients correctly')
    }
  }


  return (
    <div className="App">

      <h1 className='heading'>Nutrition Analysis</h1>

      {loader && <LoaderPage />}
      <form onSubmit={finalSearch} className='formcontainer'>
        <input className="input" type='text' placeholder='Enter ingredients here' onChange={recipeSearchResult} />

        <p className='text'>Enter as the following example: "1 cup rice,10 oz chickpeas"</p>

        <button className='btn' type='submit'><p className='copy'>Search</p></button>
      </form>
      <div className='result'>
      {nutritionResult && <p>{nutritionResult.calories} kcal</p>
      }
      {
        nutritionResult && Object.values(nutritionResult.totalNutrients).map(({ label, quantity, unit }, index) =>
          <Nutrition
            key={index}
            label={label}
            quantity={quantity}
            unit={unit} />
        )
        }
      </div>
    </div>
  );
}

export default App;
