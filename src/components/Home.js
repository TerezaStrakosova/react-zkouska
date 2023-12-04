import React, { useState, useEffect, useRef } from 'react';
import "./Home.css";

const Home = () => {
    const fish = []

    //uložení proměnné bez znovuvyrenderování komponenty
    const fishCount = useRef(fish.length);

    const [listOfFish, setListOfFish] = useState(fish);
    const [valid, setValid] = useState(false);
    const [activeTab, setActiveTab] = useState('list-of-fish');
    const [buttonColor, setButtonColor] = useState('button-red')
    const [validAquarium, setValidAquarium] = useState(false)
    const [aquaText, setAquaText] = useState("")

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

        const totalRequirements = (pocetMalychRyb * 10) + (pocetVelkychRyb * 20)

        if ((newAquarium.height * newAquarium.length * newAquarium.width) >= totalRequirements && (newAquarium.height !== "" && newAquarium.width !== "" && newAquarium.length !=="") && totalRequirements != 0) {
            setButtonColor('button-green');
            setValidAquarium(true)
            setAquaText(`Akvárium je pro rybičky dost velké. Celkový objem tohoto akvária je ${newAquarium.height * newAquarium.length * newAquarium.width} dm³ (${newAquarium.width} dm * ${newAquarium.length} dm * ${newAquarium.height} dm).`)
        } else if ((newAquarium.height * newAquarium.length * newAquarium.width) >= totalRequirements && (newAquarium.height !== "" && newAquarium.width !== "" && newAquarium.length !=="") && totalRequirements === 0) {
            setButtonColor('button-green');
            setValidAquarium(true)
            setAquaText("")
        } else if((newAquarium.height * newAquarium.length * newAquarium.width) <= totalRequirements && (newAquarium.height !== "" && newAquarium.width !== "" && newAquarium.length !=="") && totalRequirements != 0) {
            setButtonColor('button-red');
            setValidAquarium(false)
            setAquaText(`Vaše rybičky potřebují akvárium o minimálním objemu ${totalRequirements} dm³, tohle akvárium má pouze ${newAquarium.height * newAquarium.length * newAquarium.width} dm³.`)
        } else {
            setButtonColor('button-red');
            setValidAquarium(false)
            setAquaText("")
        }
    }, [newAquarium, listOfFish])

    const validateData = (validateFish) => {
        if (validateFish.name.trim().length === 0 || !validateFish.size)
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
        alert("Akvárium bylo schváleno.")
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

                            <div>
                            <p>Velikost rybičky:</p>
                            <input type="radio" id="mala" name="size" value="Malá" checked={newFish.size === "Malá"} onChange={handleChange}></input>
                              <label htmlFor='mala'>Malá</label><br />
                            <input type="radio" id="velka" name="size" value="Velká" checked={newFish.size === "Velká"} onChange={handleChange}></input>
                              <label htmlFor='velka'>Velká</label><br />
                            </div>
                            

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
                    <p className='aqua-text'>{aquaText}</p>
                    <form className='aquarium-form'>
                        <input className='aquarium-input'
                            type='number'
                            min='0'
                            placeholder='šířka (v dm)'
                            name='width'
                            value={newAquarium.width}
                            onChange={handleAquarium}
                        />

                        <input className='aquarium-input'
                            type='number'
                            min='0'
                            placeholder='délka (v dm)'
                            name='length'
                            value={newAquarium.length}
                            onChange={handleAquarium}
                        />

                        <input className='aquarium-input'
                            type='number'
                            min='0'
                            placeholder='výška (v dm)'
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

