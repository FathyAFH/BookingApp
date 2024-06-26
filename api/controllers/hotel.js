import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";

const createHotel = async (req,res,next)=>{
    const newHotel = new Hotel(req.body);

    try{
        const savedHotel = await newHotel.save()
        res.status(200).json(savedHotel)

    }catch(err){
        next(err);  
    }
};

const updateHotel = async (req,res,next)=>{
    try{
        const updated = await Hotel.findByIdAndUpdate(req.params.id, {$set:req.body}, {new:true})
        res.status(200).json(updated)
    }catch(err){
        next(err);
    }
};

const deleteHotel = async (req,res,next)=>{
    try{
        await Hotel.findByIdAndDelete(req.params.id)
        res.status(200).json("Deleted!")
    }catch(err){
        next(err);
    }
};

const getHotel = async (req,res)=>{
    try{
        const gettingHotel =await Hotel.findById(req.params.id)
        res.status(200).json(gettingHotel)
    }catch(err){
        res.status(500).json(err)
    }
};

const getAllHotels = async (req,res,next)=>{
    const {min,max,...others} =req.query;
    try{
        const hotels = await Hotel.find({
            ...others,
            cheapest:{$gt:min|| 1, $lt:max ||999},
            }).limit(4)
        res.status(200).json(hotels)
    }catch(err){
        next(err)
    }
};

const countByCity = async (req,res,next)=>{
    const cities = req.query.cities.split(',');
    try{
        const list = await Promise.all(cities.map(city =>{
            return Hotel.countDocuments({city:city})
        }))
        res.status(200).json(list)
    }catch(err){
        next(err)
    }
};

const countByType = async (req,res,next)=>{
    try{
    const hotelCount = await Hotel.countDocuments({type:"hotel"});
    const apartmentCount = await Hotel.countDocuments({type:"apartment"});
    const resortCount = await Hotel.countDocuments({type:"resort"});
    const villaCount = await Hotel.countDocuments({type:"villa"});
    const cabinCount = await Hotel.countDocuments({type:"cabin"});

    res.status(200).json([
        {type:"hotel", count:hotelCount},
        {type:"apartment", count:apartmentCount},
        {type:"resort", count:resortCount},
        {type:"villa", count:villaCount},
        {type:"cabin", count:cabinCount}
    ])
    }catch(err){
        next(err)
    }
};

export const getHotelRooms = async (req,res,next) =>{
    try{
        const getHotel = await Hotel.findById(req.params.id);
        const getRoom = await Promise.all(Hotel.rooms.map(room=>{
            return Room.findById(room)
        }))
    }catch(err){
        next(err);
    }
}



export {countByType, countByCity, createHotel, updateHotel, deleteHotel,getHotel, getAllHotels};


