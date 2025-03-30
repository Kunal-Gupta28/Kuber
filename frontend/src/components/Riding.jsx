import {Link} from "react-router-dom"
const Riding = () => {
  return (
    <div className="h-screen">
        <Link to="/home">
        <span className="fixed top-2 right-5 text-3xl p-3 bg-white rounded-full "><i class="ri-home-4-line"></i></span>
        </Link>
        {/* destination path */}
      <div className="h-1/2 overflow-hidden">
        {" "}
        <img

          src="https://www.uberpeople.net/attachments/f0d80c4c-0028-4900-aeed-b67168c657b2-jpeg.667694/"
        />
      </div>

      {/* payment page */}
          {/* selected vehicle image  */}
    <div className="my-2 flex justify-center relative ">
      <span className="h-20 w-64 bg-[#eff3fe] rounded-full flex justify-center">
        <span className="h-16 bg-[#d4e2fc] rounded-full w-44 flex justify-center">
          <img
            className="w-40 absolute top-[-8%]"
            // src={confirmRideDetails.image}
          />
        </span>
      </span>
    </div>

    {/* pick-up address */}
    <div className="flex border-t-2 border-grey py-3">
      <span className="w-16 flex justify-center items-center">
        <i className="ri-map-pin-line"></i>
      </span>
      <div>
        {/* {confirmRideDetails.address}{" "} */}
        <h3 className="font-semibold text-xl pb-1">562/11-A</h3>
        <h5 className="text-gray-500 text-md">
          Kalkondrahalli, Bengaluru, karnataka
        </h5>
      </div>
    </div>

    {/* destination */}
    <div className="flex">
      <span className="w-16 flex justify-center items-center">
        <i className="ri-square-fill"></i>
      </span>
      <div className="border-t-2 border-grey py-3">
        <h3 className="font-semibold text-xl pb-1">third wabe congee</h3>
        <h5 className="text-gray-500 text-md">
          17th Cross Pd, Pes quality,1ast selcto, Hsst layout, benfaluru,
          karnataka
        </h5>
      </div>
    </div>

    {/* bill info */}
    <div className="flex">
      <span className="w-16 flex justify-center items-center">
        <i className="ri-bank-card-2-fill"></i>
      </span>
      <div className="w-full border-t-2 border-grey py-3">
        <h3 className="font-semibold text-xl pb-1">
          {/* ₹{confirmRideDetails.price} */}
        </h3>
        <h3 className="text-gray-500 text-md"> Cash </h3>
      </div>
    </div>

    {/* payment button */}
    <button
        className="w-52 mx-auto block my-5 py-2 bg-black rounded-xl text-white font-bold text-xl"
      >
        Make a payment
      </button>
    </div>
  );
};

export default Riding;
