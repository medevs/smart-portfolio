interface Technology {
  name: string;
  icon: string;
  category: string;
  description?: string;
}

export const techCategories = {
  frontend: [
    {
      name: 'React',
      icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg',
      description: 'A JavaScript library for building user interfaces'
    },
    {
      name: 'Next.js',
      icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/nextjs/nextjs-original.svg',
      description: 'The React Framework for Production'
    },
    {
      name: 'TypeScript',
      icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg',
      description: 'Typed JavaScript at Any Scale'
    },
    {
      name: 'Tailwind CSS',
      icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/tailwindcss/tailwindcss-plain.svg',
      description: 'A utility-first CSS framework'
    }
  ],
  backend: [
    {
      name: 'Node.js',
      icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original.svg',
      description: 'JavaScript runtime built on Chrome\'s V8 JavaScript engine'
    },
    {
      name: 'Python',
      icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/python/python-original.svg',
      description: 'A programming language that lets you work quickly'
    },
    {
      name: 'Java',
      icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/java/java-original.svg',
      description: 'Write once, run anywhere'
    },
    {
      name: 'Go',
      icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/go/go-original.svg',
      description: 'Build simple, reliable, and efficient software'
    }
  ],
  database: [
    {
      name: 'PostgreSQL',
      icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/postgresql/postgresql-original.svg',
      description: 'The World\'s Most Advanced Open Source Relational Database'
    },
    {
      name: 'MongoDB',
      icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/mongodb/mongodb-original.svg',
      description: 'The application data platform'
    },
    {
      name: 'Redis',
      icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/redis/redis-original.svg',
      description: 'Open source, in-memory data store'
    }
  ],
  devops: [
    {
      name: 'Docker',
      icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/docker/docker-original.svg',
      description: 'Develop, Ship, and Run Anywhere'
    },
    {
      name: 'Kubernetes',
      icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/kubernetes/kubernetes-plain.svg',
      description: 'Production-Grade Container Orchestration'
    },
    {
      name: 'AWS',
      icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/amazonwebservices/amazonwebservices-original.svg',
      description: 'The Most Complete Cloud Platform'
    }
  ],
  testing: [
    {
      name: 'Jest',
      icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/jest/jest-plain.svg',
      description: 'Delightful JavaScript Testing'
    },
    {
      name: 'Cypress',
      icon: 'https://raw.githubusercontent.com/simple-icons/simple-icons/6e46ec1fc23b60c8fd0d2f2ff46db82e16dbd75f/icons/cypress.svg',
      description: 'Fast, easy and reliable testing for anything that runs in a browser'
    }
  ]
} as const;
