import type { V2_MetaFunction } from "@remix-run/node";
import { AppContainer } from "~/components/layout/AppContainer";
import { AppLink } from "~/components/AppLink";
import { AppLinkExternal } from "~/components/AppLinkExternal";

export const meta: V2_MetaFunction = () => [
  {
    title: "About | Boards",
  },
];

const AboutPage = () => (
  <AppContainer>
    <div className="space-x-3 flex mb-3 items-center font-bold">
      <div className="text-2xl">
        <AppLink href="/">Boards</AppLink>
      </div>
      <div className="text-xl">›</div>
      <div>About</div>
    </div>
    <h1 className="text-2xl font-bold"> Introduction</h1>
    <p>Welcome to "Boards" - Your Personal Messageboard Experience!</p>
    <h2 className="text-xl font-bold mt-2">About the Project</h2>
    <p>
      "Boards" is a personal project, created and developed by a passionate
      individual seeking to expand their programming skills in .NET and Kotlin,
      while also exploring project management through the use of Kanban
      methodology.
    </p>
    <p>
      This 4chan-inspired messageboard platform aims to provide users with a
      dynamic and interactive space for discussions, content sharing, and
      connecting with like-minded individuals.
    </p>
    <h3 className="text-xl font-bold mt-2"> Changelog Page</h3>
    <p>
      Stay updated with the latest changes and improvements to the "Boards"
      platform through our <AppLink href="/changelog">Changelog </AppLink>
      page. As a solo developer, I'm committed to continuous improvement, and
      your valuable feedback will shape the growth and enhancements of "Boards"
      over time.
    </p>
    <h3 className="text-xl font-bold mt-2">Unmoderated Environment</h3>
    <p>
      It's important to keep in mind that "Boards" is a personal project and is
      not heavily moderated. While we encourage respectful interactions, users
      should exercise discretion while browsing and participating in
      discussions.
    </p>
    <h3 className="text-xl font-bold mt-2">Key Features</h3>
    <ul className="list-disc list-inside">
      <li>
        <b>Multiple boards</b> - "Boards" features a diverse range of boards,
        each catering to specific topics and interests.
      </li>
      <li>
        <b>Threads and Posts</b> - Users can create new threads within the
        relevant boards, initiating discussions on specific topics. Join in the
        conversation by posting your thoughts and replies.
      </li>
      <li>
        <b>Multimedia Integration</b> - Share your favorite images and YouTube
        videos directly within your posts. Enhance discussions and communication
        with the visual power of multimedia content.
      </li>
      <li>
        <b>Quoting Replies</b> - Engage seamlessly with other users by quoting
        their posts. This feature ensures focused discussions and maintains the
        flow of conversations.
      </li>
    </ul>
    <h3 className="text-xl font-bold mt-2">Future Development</h3>
    <p>
      As a solo developer, I'm dedicated to continuously improving "Boards" to
      provide you with the best user experience possible. Your feedback and
      ideas are invaluable, and your contributions will help shape the future of
      this platform.
    </p>
    <h3 className="text-xl font-bold mt-2">Android Application</h3>
    <p>
      In addition to the web version, I'm also developing an Android application
      that will bring the "Boards" experience to your mobile devices. Watch out
      for updates, and soon you'll be able to download it from the Play Store!
    </p>
    <h3 className="text-xl font-bold mt-2">Join the Journey</h3>
    <p>
      Join me on this exciting journey as we transform "Boards" into not only a
      space for learning and programming practice but also a vibrant community
      fostering meaningful discussions and connections. Together, let's create
      something extraordinary!
    </p>
    <h3 className="text-xl font-bold mt-2">Links</h3>
    <ul className="list-disc list-inside">
      <li>
        <AppLinkExternal href="https://kolaczyn.com">
          Personal Website
        </AppLinkExternal>
      </li>
      <li>
        <AppLinkExternal href="https://github.com/users/kolaczyn/projects/3">
          Kanban Board
        </AppLinkExternal>
      </li>
      <li>
        <AppLinkExternal href="https://github.com/kolaczyn/boards-frontend">
          Frontend Code
        </AppLinkExternal>
      </li>
      <li>
        <AppLinkExternal href="https://github.com/kolaczyn/boards-backend">
          Core Backend Code
        </AppLinkExternal>
      </li>
      <li>
        <AppLinkExternal href="https://github.com/kolaczyn/boards-feeds">
          Feeds Backend Code
        </AppLinkExternal>
      </li>
      <li>
        <AppLinkExternal href="https://github.com/kolaczyn/boards-discord">
          Discord Bot Code
        </AppLinkExternal>
      </li>
      <li>
        <AppLinkExternal href="https://github.com/kolaczyn/boards-android">
          Android Code
        </AppLinkExternal>
      </li>
    </ul>
    <div className="mb-12" />
  </AppContainer>
);

export default AboutPage;
