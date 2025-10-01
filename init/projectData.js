const seedProjects = [
    {
        title: "Village Road Construction",
        description: "Building a 2 km concrete road from main market to school.",
        startDate: new Date("2025-01-10"),
        completeDate: new Date("2025-06-15"),
        budget: 500000,
        milestones: [
            { name: "Survey & Planning", completed: false },
            { name: "Foundation Work", completed: false },
            { name: "Pavement Construction", completed: false },
            { name: "Finishing & Marking", completed: false }
        ],
        image: [{
            filename: "road-project",
            url: "https://assets.telegraphindia.com/telegraph/2024/Jul/1719897564_new-project-6.jpg"
        }],
        admin: '68d7c67fa0c05a7bf0afd4e3'
       
    },
    {
        title: "School Building Renovation",
        description: "Renovation of old government school with new classrooms, painting, and toilets.",
        startDate: new Date("2025-02-01"),
        completeDate: new Date("2025-08-01"),
        budget: 1200000,
        milestones: [
            { name: "Demolition of old structures", completed: true },
            { name: "Foundation Work", completed: true },
            { name: "Wall Construction", completed: false },
            { name: "Roofing", completed: false },
            { name: "Painting & Toilets", completed: false }
        ],
        image: [{
            filename: "school-project",
            url: "https://repository.education.gov.in/wp-content/uploads/2021/06/construction_school_building6.jpeg"
        }],
        admin: '68d7c67fa0c05a7bf0afd4e3'
        
    },
    {
        title: "Village Pond Cleaning",
        description: "Cleaning and deepening the pond to improve water storage.",
        startDate: new Date("2025-03-05"),
        completeDate: new Date("2025-04-20"),
        budget: 300000,
        milestones: [
            { name: "Survey & Plan", completed: true },
            { name: "Waste Removal", completed: true },
            { name: "Deepening Pond", completed: true },
            { name: "Boundary Wall Construction", completed: false }
        ],
        image: [{
            filename: "pond-project",
            url: "https://media.dtnext.in/imported/import/Images/Article/201609012353315518_City-NGO-helps-restore-water-bodies-in-suburban-areas_SECVPF.gif"
        }],
        admin: '68d7c67fa0c05a7bf0afd4e3'
        
    }
];

module.exports = seedProjects;