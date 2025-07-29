import { LuCalendarCheck, LuCoins, LuGift, LuMapPin, LuScale, LuTruck } from "react-icons/lu";
import { PiCalendarCheck, PiMapPin, PiScales, PiTruckTrailer } from "react-icons/pi";

// Mock data
const pickups = [
  {
    pickup_id: "PKP-001",
    requested_date: "2025-04-12",
    picked_date: null,
    green_coins_awarded: 0,
    status: "out for pickup",
    address: {
        name: "John Smith",
        street: "123 Main Street",
        city: "San Francisco",
        state: "CA",
        zip: "94105",
        phone:"+91 7867390782"
      },
    weight: 9
  },
  {
    pickup_id: "PKP-002",
    requested_date: "2025-04-15",
    picked_date: null,
    green_coins_awarded: 0,
    status: "pending",
    address: {
        name: "John Smith",
        street: "123 Main Street",
        city: "San Francisco",
        state: "CA",
        zip: "94105",
        phone:"+91 7867390782"
      },
    weight: 15
  },
  {
    pickup_id: "PKP-003",
    requested_date: "2025-04-10",
    picked_date: "2025-04-25",
    green_coins_awarded: 299,
    status: "picked",
    address: {
        name: "John Smith",
        street: "123 Main Street",
        city: "San Francisco",
        state: "CA",
        zip: "94105",
        phone:"+91 7867390782"
      },
    weight: 15
  },
  {
    pickup_id: "PKP-004",
    requested_date: "2025-04-10",
    picked_date: "2025-04-12",
    green_coins_awarded: 0,
    status: "canceled",
    address: {
        name: "John Smith",
        street: "123 Main Street",
        city: "San Francisco",
        state: "CA",
        zip: "94105",
        phone:"+91 7867390782"
      },
    weight: 7
  },
];

// Utility function
const formatDate = (dateStr) => {
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateStr).toLocaleDateString(undefined, options);
};


const PickupHistory = () => {

  const getStatusColor = (status) => {
    switch (status) {
      case "canceled":
        return "text-red-500"
      case "picked":
        return "text-lgg";
      case "pending":
        return "text-blue-500";
      case "out for pickup":
        return "text-orange-500";
      default:
        return "text-neutral-400";
    }
  };

  const getEstimatedPickup = (requested_date) => {
    const reqDate = new Date(requested_date);
    const estDate = new Date(reqDate);
    estDate.setDate(reqDate.getDate() + 3);
  
    return (
      <>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">Estimated Delivery</p>
        <p className="font-medium">{formatDate(estDate)}</p>
      </>
    );
  };
  

  return (
      <div className="mx-auto px-4 max-w-5xl  text-tc dark:text-ow">
        <div className="flex items-center gap-3 mb-4 mt-4">
          <LuTruck strokeWidth={1.5} size={28} className="text-lgg" />
          <h1 className="text-2xl font-semibold">Pickup History</h1>
        </div>
        {pickups.length === 0 ? (
            <div className="text-center py-12">
            <p className="text-neutral-500">No pickups found</p>
            </div>
            ) : (
            <div className="space-y-4">
                {pickups.map((pickup) => 
                    <div key={pickup.pickup_id} className="bg-white dark:bg-dtc rounded-md p-3 sm:p-8 border border-neutral-200 dark:border-neutral-600">
                        <div className="flex items-center justify-between gap-2 mb-4">
                            <p className="font-semibold">{pickup.pickup_id}</p>
                            <span
                                className={`text-sm px-2 rounded-full ${getStatusColor(pickup.status)}`}
                            >
                                {pickup.status}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 items-center text-tc dark:text-ow">
                            <div className="flex flex-col justify-center">
                                <div className="flex items-center gap-2 mb-4">
                                    <LuCalendarCheck strokeWidth={1.5} className="w-5 h-5 text-neutral-500 dark:text-neutral-400" />
                                    <div>
                                        <p className="text-sm text-neutral-500 dark:text-neutral-400">Requested On</p>
                                        <p className="font-medium">{formatDate(pickup.requested_date)}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 mb-4">
                                    <LuTruck strokeWidth={1.5} className="w-5 h-5 text-neutral-500 dark:text-neutral-400" />
                                    {pickup.status === 'canceled' ?
                                        <div>
                                            <p className="text-sm text-neutral-500 dark:text-neutral-400">Canceled On</p>
                                            <p className="font-medium">{formatDate(pickup.picked_date)}</p>
                                        </div>:
                                        pickup.picked_date ? (
                                            <div>
                                                <p className="text-sm text-neutral-500 dark:text-neutral-400">Picked On</p>
                                                <p className="font-medium">{formatDate(pickup.picked_date)}</p>
                                            </div>
                                            ) : (
                                            <div>{getEstimatedPickup(pickup.requested_date)}</div>
                                        )
                                    }
                                    

                                </div>
                            </div>

                            <div className="flex flex-col justify-center">
                                <div className="flex items-center gap-2 mb-4">
                                    <LuScale strokeWidth={1.5} className="w-5 h-5 text-neutral-500 dark:text-neutral-400" />
                                    <div>
                                        <p className="text-sm text-neutral-500 dark:text-neutral-400">Plastic Weight</p>
                                        <p className="font-medium">{pickup.weight} kg</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 mb-4">
                                    <LuGift strokeWidth={1.5} className="w-5 h-5 text-neutral-500 dark:text-neutral-400" />
                                    <div>
                                        <p className="text-sm text-neutral-500 dark:text-neutral-400">Green Coins Earned</p>
                                        {pickup.status === 'canceled' ?
                                            <p className="font-medium">Pickup Canceled</p>:
                                                pickup.green_coins_awarded !== 0 ? 
                                                    <p className="font-medium">{pickup.green_coins_awarded}</p>:
                                                    <p className="font-medium">Not Picked Yet</p>
                                        }
                                    </div>                           

                                </div>
                            </div>

                            <div className="flex flex-col justify-center">
                                <div className='flex items-center gap-2 font-medium'>
                                    <LuMapPin strokeWidth={1.5} className='w-5 h-5 text-neutral-500 dark:text-neutral-400' />
                                    <p className="text-sm text-neutral-400">Pickup Address</p>
                                </div>
                                <div className="space-y-1 pl-7">
                                    <p className="text-lg font-semibold text-tc dark:text-white">
                                        {pickup.address.name}
                                    </p>
                                    <p className="text-sm text-neutral-600 dark:text-neutral-300">{pickup.address.street}</p>
                                    <p className="text-sm text-neutral-600 dark:text-neutral-300">
                                        {pickup.address.city}, {pickup.address.state} - {pickup.address.zip}
                                    </p>
                                    <p className="text-sm text-tc dark:text-neutral-300">
                                        Phone: <span className='font-semibold'>{pickup.address.phone}</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        )}
    </div>
  );
};

export default PickupHistory;
