import React, { useState, useEffect, useRef } from 'react';
import "./Home.css";

const Home = () => {
    const fish = []

    //uložení proměnné bez znovuvyrenderování komponenty
    const fishCount = useRef(fish.length);

    const [listOfFish, setListOfFish] = useState(fish);
    const [valid, setValid] = useState(false);
    const [activeTab, setActiveTab] = useState('list-of-fish');
    const [buttonColor, setButtonColor] = useState('')
    const [validAquarium, setValidAquarium] = useState(false)

    const [newAquarium, setNewAquarium] = useState({
        width: "",
        length: "",
        height: "",
    });

    const [newFish, setNewFish] = useState({
        id: fishCount.current + 1,
        name: "",
        size: "",
    });

    useEffect(() => {
        let pocetVelkychRyb = 0
        let pocetMalychRyb = 0

        // Procházení každého objektu v poli
        listOfFish.forEach(oneFish => {
            const size = oneFish.size.toLowerCase();
            if (size === "velká" || size === "velka") {
                    pocetVelkychRyb++
            } else if (size === "malá" || size === "mala") {
                    pocetMalychRyb++
            }
        })
        console.log("Počet velkých ryb: " + pocetVelkychRyb)
        console.log("Počet malých ryb: " + pocetMalychRyb)

        const totalRequirements = (pocetMalychRyb * 10) + (pocetVelkychRyb * 20)

        if ((newAquarium.height * newAquarium.length * newAquarium.width) >= totalRequirements && (newAquarium.height !== "" && newAquarium.width !== "" && newAquarium.length !=="")) {
            setButtonColor('button-green');
            setValidAquarium(true)
        } else {
            setButtonColor('button-red');
            setValidAquarium(false)
        }
    }, [newAquarium, listOfFish])

    const validateData = (validateFish) => {
        if (validateFish.name.trim().length === 0)
            return setValid(false);
        if (validateFish.size.trim().length === 0 || (validateFish.size.toLowerCase() !== "malá" && validateFish.size.toLowerCase() !== "mala" && validateFish.size.toLowerCase() !== "velká" && validateFish.size.toLowerCase() !== "velka" )) 
            return setValid(false);
        return setValid(true);
    }


    function handleAdd(event) {
        event.preventDefault()
        let pushFish = true

        if (pushFish) {
            setListOfFish((listOfFish) => {
                //vrácení nového listu + v něm newFish
                return [...listOfFish, newFish];
            });

            fishCount.current++;
            const updateFish = {
                id: fishCount.current + 1,
                name: "",
                size: "",
            }
            setNewFish(updateFish);
            //buď tato funkce nebo spodní zakomentovaná, result je stejný
            //validateData(updateFish);

            setValid(false);
        }
        else {
            alert("Nemůžeš přidat rybku")
        }
    }

    function handleChange(event) {
        const updateFish = { ...newFish, [event.target.name]: event.target.value };
        setNewFish(updateFish);
        validateData(updateFish);
    }

    function handleDelete(fishID) {
        setListOfFish(
            listOfFish.filter((fish) => {
                if (fishID !== fish.id)
                    return fish
            })
        );
    }

    const handleAquarium = (event) => {
        const input = event.target.value;
        const nameOfInput = event.target.name;

        const updateAquarium = { ...newAquarium, [nameOfInput]: input }

        setNewAquarium(updateAquarium);
    }

    const updateAquarium = (event) => {
        event.preventDefault()
        alert("Akvárium je pro rybičky dost velké, takže bylo schváleno.")
        setNewAquarium({
            width: "",
            length: "",
            height: "",
        });
    }

    return (
        <div>
            <div className='buttons'>
                <button className='main-button'
                    onClick={() => setActiveTab('list-of-fish')}
                    name='list-of-fish'
                    data-active={activeTab === 'list-of-fish'}>
                    Rybičky
                </button>
                <button className='main-button'
                    onClick={() => setActiveTab('aquarium')}
                    name='aquarium'
                    data-active={activeTab === 'aquarium'}>
                    Akvárium
                </button>
            </div>
            {(activeTab === 'list-of-fish') &&
                <>
                    <div name='fishList' className='fish-list'>
                        {
                            listOfFish.map((fish) => {
                                return (
                                    <div key={fish.id} className='fish-list-row'>
                                        <p>
                                            {fish.name} / {fish.size}
                                        </p>
                                        <button onClick={() => handleDelete(fish.id)} className='delete-button'>
                                            X
                                        </button>
                                    </div>

                                )
                            })
                        }

                        <form className='add-form'>
                            <input
                                type="text"
                                placeholder="Jméno rybičky"
                                name='name'
                                value={newFish.name}
                                onChange={handleChange}
                            />

                            <input
                                type="text"
                                placeholder="Druh (malá/velká)"
                                name='size'
                                value={newFish.size}
                                onChange={handleChange}
                            />

                            <button
                                disabled={!valid}
                                onClick={handleAdd}>
                                Přidat
                            </button>

                        </form>

                    </div>
                </>
            }

            {(activeTab === 'aquarium') &&
                <>
                    <form className='aquarium-form'>
                        <input className='aquarium-input'
                            type='number'
                            min='0'
                            placeholder='šířka'
                            name='width'
                            value={newAquarium.width}
                            onChange={handleAquarium}
                        />

                        <input className='aquarium-input'
                            type='number'
                            min='0'
                            placeholder='délka'
                            name='length'
                            value={newAquarium.length}
                            onChange={handleAquarium}
                        />

                        <input className='aquarium-input'
                            type='number'
                            min='0'
                            placeholder='výška'
                            name='height'
                            value={newAquarium.height}
                            onChange={handleAquarium}
                        />
                       <button className={`${buttonColor} aquarium-button`} onClick={updateAquarium} disabled={!validAquarium}>
                            Schválit akvárium
                        </button>

                    </form>
                </>
            }
        </div >
    );
}

export default Home;

