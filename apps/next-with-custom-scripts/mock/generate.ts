import  { z } from 'zod'
import { generateMock } from '@anatine/zod-mock'
import { faker } from '@faker-js/faker'
import fs from 'fs'

const userSchema = () => {
    return z.object({
        id: z.string().uuid(),
        fname: z.string(),
        lname: z.string(),
        email: z.string().email(),
    }).array().length(20)
}


const users = generateMock(userSchema())

const vehicleSchema = (user_ids: [string]) => {
    return z.object({
        id: z.string().uuid(),
        color: z.string(),
        user_id: z.enum(user_ids)
    })
}

const ids = users.map(({id})=>id)

const vehicles = generateMock(vehicleSchema(ids as [string]).array().length(40), {
    stringMap: {
        color: faker.internet.color
    }
})

console.log(vehicles)

fs.writeFile('mock/db.json', JSON.stringify({
    users,
    vehicles
}), 'utf-8', (err)=>{
    if(err){
        console.log("An error occured while writting to file")
    }else{
        console.log("All done")
    }
})

export const bigup = (argv: any) => {
    console.log("argv", argv)
}
