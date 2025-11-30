import * as DBservice from "../DB/DB.service.js";
import chapterModel from "../models/chapterModel.js";
import connectDB from "../DB/DB.connection.js";
const chapters =
[
    {
        
        code: "cs",
        name: "Computer Society",
        brief: "Dedicated to software development, programming, and emerging technologies.",
        description: "Dedicated to software development, programming, and emerging technologies.\nCS currently includes 3 specialized tracks, Web Development, Mobile Application, and Cyber Security ,providing members with hands-on experience through coding bootcamps, hackathons, and technical challenges."
      },
      {
        code: "comsoc",
        name: "Communication Society",
        brief: "Focused on the ever-evolving world of AI and communication systems.",
        description: "Focused on the ever-evolving world of AI and communication systems. ComSoc offers 4 diverse tracks which are Analog IC, Digital IC, Embedded Systems and Machine Learning, where students explore real-world communication technologies through practical workshops and innovative projects."
      },
      {
        code: "wie",
        name: "Women in Engineering",
        brief: "An affinity group dedicated to empowering and inspiring female engineers.",
        description: "An affinity group dedicated to empowering and inspiring female engineers. WIE runs 2 specialized track for girls, this year is about Java Script and graphic design, while also encouraging its members to join any other technical or non technical track across the branch to broaden their learning and leadership experiences."
      },
      {
        code: "ras",
        name: "Robotics & Automation Society",
        brief: "Merging creativity with engineering.",
        description: "Merging creativity with engineering, RAS develops students’ technical and design skills through robotics challenges and automation projects. It includes 1 integrated track combining both mechanical and control aspects of robotics."
      },
      {
        code: "pes",
        name: "Power & Energy Society",
        brief: "The heart of electrical power, renewable energy, and sustainability.",
        description: "The heart of electrical power, renewable energy, and sustainability. PES proudly includes 6 active tracks, Home Automation, Basic & Advanced Industerial Automation, Renewable Energy, and Electric Distribution (AutoCAD & REVIT), that deliver technical sessions, industrial visits, and innovation projects, preparing students for careers in the energy sector."
      }
];

console.log(chapters.length);


const seedChapters = async()=>{
    try {

        
        await connectDB();
        const createdChapters = await DBservice.create({ model: chapterModel, data: chapters });
        console.log("chapters seeded successfully");
        process.exit(0);
    } catch (error) {
        console.log("error seeding chapters", chapters.length);
        console.log(error);
        process.exit(1);
    }
}

seedChapters();
