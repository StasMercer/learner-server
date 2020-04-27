const { gql } = require('apollo-server');

module.exports = gql`
    type Test {
        question: String!
        variants: [String]
        answer: [Int]
    }
    type StudentTest{
        testMade: Boolean
        studentAnswer:[Int]
        rightAnswer: [Int]
    }
    
    type StudentChapter {
       
        wasMade: Boolean!
        studentTest: [StudentTest]
    }

    type StudentProgress {
        right: Int!,
        wrong: Int!
        courseId: ID!
        courseName: String!
        chapters: [StudentChapter]
    }

    type User {
        id: ID!
        firstName: String!
        lastName: String!
        email: String!
        role: String!
        password: String!
        createdAt: String!
        token: String!
        progress: [StudentProgress]
    }

    type ChapterContent {
        id: ID!
        courseId: ID!
        chapterName: String!
        text: String!
        type: String!
        media: String
        tests: [Test]
    }

    type Course {
        id: ID!
        courseName: String!
        createdAt: String!
        description: String!
        chapters: [ChapterContent]
        members: [User]
        membersCount: Int!
        owner: ID!
        ownerName: String!
    }

    type CoursesFeed {
        cursor: String!
        hasMore: Boolean!
        courses: [Course]!
    }
    type ShortCourse{
        id: ID!
        courseId: ID!,
        courseName: String!,
    }
    type CycleCourse{
        id: ID!,
        cycleName: String!
        courses: [ShortCourse]!
    }
    input RegisterInput {
        firstName: String!
        lastName: String!
        email: String!
        role: String!
        password: String!
        confirmPassword: String!
    }
    type Message{
        messageHeader: String!
        messageText: String!
        createdAt: String!
    }
    
    type AdminContent {
        id: ID!
        contentName: String!
        messages: [Message]
    }
    input TestInput {
        question: String!
        variants: [String]
        answer: [Int]
    }

    input ChapterInput {
        courseId: ID!
        chapterName: String!
        text: String!
        type: String!
        media: String
    }

    type Query {
        getCourses: [Course]
        getCycles: [CycleCourse]
        getCourse(courseId: ID!): Course!
        getUser: User!
        getCoursesFeed(pageSize: Int, after: String): CoursesFeed!
        getAdminContent: [AdminContent]
        getAdminContentById(contentId: ID!): AdminContent!
        searchCourses(partOfName: String!):[Course]!
    }

    type Mutation {
        register(registerInput: RegisterInput): User!
        login(email: String!, password: String!): User!
        createCourse(courseName: String!, description: String!): User!
        removeCourse(courseId: ID!): Boolean!
        updateTestInChapter(
            courseId: ID!
            chapterIndex: Int!
            testIndex: Int!
            test: TestInput!
        ): Boolean!
        addChapterToCourse(chapterInput: ChapterInput): Course!
        removeChapterFromCourse(courseId: ID!, chapterIndex: Int!): Course!
        addTestToCourse(
            courseId: ID!
            chapterIndex: Int!
            test: TestInput
        ): Test!
        removeTestFromCourse(
            courseId: ID!
            chapterIndex: Int!
            testIndex: Int!
        ): ChapterContent!
        addUserToCourse(courseId: ID!): User!
        removeUserFromCourse(courseId: ID!): User!
        updateUserProgress(
            courseId: ID!
            chapterIndex: Int!
            wasMade: Boolean!
            testIndex: Int
            rightAnswer: [Int]
            studentAnswer: [Int]
        ): User!
        updateChapter(
            courseId: ID!
            chapterIndex: Int!
            chapterName: String!
            text: String!
            media: String
            type: String!
        ): Course!
        createCycle(cycleName: String!): CycleCourse
        removeCycle(cycleId: ID!): [CycleCourse!]!
        addCourseToCycle(courseId: ID!, cycleId: ID!):CycleCourse
        removeCourseFromCycle(courseIndex: Int!, cycleId: ID!):CycleCourse
        createAdminContent(contentName: String!): AdminContent!
        removeAdminContent(contentId:ID!): [AdminContent]!
        addMessage(contentId: ID! messageHeader: String! messageText: String): AdminContent!
        removeMessage(contentId:ID!, messageIndex: Int!): AdminContent!
    }
`;
