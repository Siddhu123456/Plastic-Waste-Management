import axios from "axios";
import React, { useEffect, useState } from "react";
import { PiMapPinFill, PiPlusCircle } from "react-icons/pi";

const Recycle = () => {
  const [selectedAddress, setSelectedAddress] = useState(null)
  const [weight, setWeight] = useState('')
  const user = JSON.parse(localStorage.getItem('user'));
  const [requesting, setRequesting] = useState(false)
  const userId = user?.id;

  useEffect(() => {
    // Simulate fetch call
    const allAddresses = [
      {
        id: 1,
        name: "John Doe",
        street: "123 Eco Street",
        city: "GreenCity",
        state: "RecycleLand",
        zip: "456789",
        phone: "+91 9876543210",
        isDefault: true
      },
      {
        id: 2,
        name: "Jane Smith",
        street: "456 Green Ave",
        city: "CleanTown",
        state: "EcoState",
        zip: "654321",
        phone: "+91 8765432109",
        isDefault: false
      }
    ];
  
    const defaultAddress = allAddresses.find(addr => addr.isDefault) || allAddresses[0];
    setSelectedAddress(defaultAddress);
  }, []);
  

  const minWeight = 10
  const maxWeight = 100



  const handleChange = (e) => {
    const { name, value } = e.target;
  
    if (name === "weight") {
      const numericValue = parseFloat(value);
      const isWithinLimit = numericValue <= 100;
      const isValid = value === "" || (!isNaN(numericValue) && numericValue >= 0 && isWithinLimit);
  
      if (isValid) {
        setWeight(value)
      }
  
      return;
    }
    };
  

  const handleWeightKeyDown = (e) => {
    const key = e.key;
    const value = e.target.value;
    const allowedDigits = ['0','1','2','3','4','5','6','7','8','9'];
    const controlKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Home', 'End'];
  
    const isDigit = allowedDigits.includes(key);
    const isDot = key === '.';
    const alreadyHasDot = value.includes('.');
  
    // If already has a dot, prevent entering more than 2 decimal digits
    if (alreadyHasDot && !controlKeys.includes(key)) {
      const decimalPart = value.split('.')[1];
      if (decimalPart?.length >= 2 && !isDot) {
        e.preventDefault();
        return;
      }
    }
  
    // Prevent invalid keys
    if (
      !isDigit &&
      !controlKeys.includes(key) &&
      !(isDot && !alreadyHasDot)
    ) {
      e.preventDefault();
    }
  };
  

  const handleSubmit = async () => {
    try {
      setRequesting(true)
      const response = await axios.post('http://localhost:8080/api/pickups/create', {
        customer: userId,
        address: selectedAddress.id,
        weight: parseInt(weight)
      });

      alert(`Pickup Request Successfull`);
      setWeight('')
    } catch (error) {
      console.error(error);
      alert('Failed to create pickup');
    }finally{
      setRequesting(false)
    }
  };
  
  return (
    <section className='grid grid-cols-12 gap-4 p-2 sm:p-4'>
    <div className="col-span-12 lg:col-span-6 bg-white dark:bg-dtc rounded-md p-4 sm:p-6">
    <h1 className="text-xl font-semibold text-lgd dark:text-lgg border-b border-neutral-300 dark:border-neutral-500 p-2">Instructions</h1>

      <ul className="list-disc text-tc dark:text-ow p-4">
        <li>Enter the estimated weight of your plastic waste (min {minWeight} kg, max {maxWeight} kg, up to 2 decimal places)</li>
        <li>Ensure your plastic is clean and dry before pickup — this helps with recycling quality.</li>
        <li>Segregate different types of plastic if possible (e.g., bottles, bags, containers).</li>
        <li><strong className="font-semibold">Pro Tip:</strong> Submitting bottles or hard plastics can earn you more <span className="text-lgd dark:text-lgg font-medium">Green Coins</span>!</li>
        <li>Add any special notes (e.g., gate code, pet on premises, large volume).</li>
        <li><strong className="font-semibold">Note:</strong> Our team will collect your waste within <span className="font-medium text-lgd dark:text-lgg">2 working days</span> of your request.</li>
        <li><strong className="font-semibold">Earn More:</strong> The cleaner and better sorted your plastic, the more coins you can earn!</li>
      </ul>
    </div>  

      {/* Pickup */}
    <div className="bg-white dark:bg-dtc rounded-md col-span-12 lg:col-span-6 p-4 sm:p-6">
      <h1 className="text-xl font-semibold text-lgd dark:text-lgg border-b border-neutral-300 dark:border-neutral-500 p-2">Request a Plastic Pickup</h1>
      {/* Address */}
      <div>
        <div className='flex items-center gap-2 pt-4 pb-2 font-medium'>
          <PiMapPinFill className='text-lgg' />
          <h2 className='text-neutral-700 dark:text-neutral-300'>Pickup Address</h2>
          {selectedAddress &&
            <button className='ml-auto font-normal cursor-pointer text-lgd dark:text-lgg hover:underline text-sm pr-4'>change</button>
          }
        </div>

          {selectedAddress ?
            <div className="bg-ow dark:bg-dsc p-4 rounded-md">
            <div className="pl-8 space-y-1">
              <p className="text-lg font-semibold text-tc dark:text-white">
                {selectedAddress.name}
              </p>
              <p className="text-sm text-neutral-600 dark:text-neutral-300">{selectedAddress.street}</p>
              <p className="text-sm text-neutral-600 dark:text-neutral-300">
                {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.zip}
              </p>
              <p className="text-sm text-tc dark:text-neutral-300">
                Phone: <span className='font-semibold'>{selectedAddress.phone}</span>
              </p>
            </div>
            </div>:
            <div className="text-center">
              <button type="button" className="inline-flex items-center hover:underline group py-1 gap-1 cursor-pointer text-sm font-medium text-neutral-600 dark:text-neutral-300">
              <PiPlusCircle className="text-lg group-hover:text-lgg" />
              Add Address
              </button>
            </div>
          }
      </div>
      <div className="mt-4 space-y-2">
      <label htmlFor="weight" className="block mb-1 text-tc dark:text-white">Estimated Weight (kg)</label>
      <input
        type="text"
        name="weight"
        id="weight"
        placeholder={`Range ${minWeight} - ${maxWeight} kg`}
        className="py-2 px-4 block w-full bg-ow dark:bg-dsc text-tc dark:text-ow border-ow dark:border-dsc border rounded-lg focus:outline-none focus:border-lgg focus:ring-lgg disabled:opacity-50 disabled:pointer-events-none dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
        value={weight}
        onChange={handleChange}
        onKeyDown={handleWeightKeyDown}
        required
      />

        {weight < minWeight ? <p className="text-center text-red-500">Minimum Weight {minWeight} kg</p>:''}
        <button type="button" onClick={handleSubmit} disabled={weight < minWeight || requesting} className="disabled:bg-neutral-500 disabled:cursor-not-allowed px-4 py-2.5 w-full font-semibold tracking-wide pri-btn">
          Submit Request
        </button>
      </div>
    </div>      
  </section>
  );
}


export default Recycle