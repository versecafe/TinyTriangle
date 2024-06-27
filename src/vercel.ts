import AsyncStorage from "@react-native-async-storage/async-storage";
var RNFS = require("react-native-fs");
import {z} from "zod";

export type Organization = {
  name: string;
  teamId: string;
  url: string;
  unreadComments: number;
  projects: {name: string}[];
};

export type Account = {
  username: string;
  gitProvider: string;
};

export class Vercel {
  user: Account = {username: "", gitProvider: ""};
  token: string = "";
  organizations: Organization[] = [];

  accountSetter: (account: Account) => void;
  orgSetter: (orgs: Organization[]) => void;

  constructor(
    accountSetter: (account: Account) => void,
    orgSetter: (orgs: Organization[]) => void,
  ) {
    console.log("Vercel");
    this.accountSetter = accountSetter;
    this.orgSetter = orgSetter;
  }
  async sync() {
    await this.getToken();

    // fetch data from Vercel
    const [userData, teamsData] = await Promise.all([
      fetch("https://api.vercel.com/v2/user", {
        headers: {Authorization: `Bearer ${this.token}`},
      }),
      fetch("https://api.vercel.com/v2/teams", {
        headers: {Authorization: `Bearer ${this.token}`},
      }),
    ]);

    // parse data
    const [teams, user] = await Promise.all([
      teamsData.json(),
      userData.json(),
    ]);

    this.user = {
      username: user.user.username,
      gitProvider: user.user.importFlowGitProvider,
    };
    this.accountSetter(this.user);

    if (teams.teams) {
      this.organizations = teams.teams.map(
        (team: {id: string; name: string; slug: string}) => ({
          name: team.name,
          teamId: team.id,
          url: `https://vercel.com/${team.slug}`,
          projects: [],
        }),
      );

      (async () => {
        for (const org of this.organizations) {
          const commentsData = await fetch(
            `https://vercel.com/api/toolbar/comments/inbox/count?teamId=${org.teamId}`,
            {
              headers: {Authorization: `Bearer ${this.token}`},
            },
          );

          const commentsJson = await commentsData.json();
          org.unreadComments = commentsJson.unread;
          const projectsData = await fetch(
            `https://api.vercel.com/v9/projects?teamId=${org.teamId}`,
            {
              headers: {Authorization: `Bearer ${this.token}`},
            },
          );
          const projectsJson = await projectsData.json();
          if (projectsJson.projects) {
            org.projects = projectsJson.projects.map(
              (project: {name: string}) => {
                return {
                  name: project.name,
                };
              },
            );
          }
        }

        // pass state up to the app
        this.orgSetter(this.organizations);
      })();
    }
  }

  async setToken() {
    const tokenValidator = z
      .string({
        required_error:
          "Token is required, make sure you set the token in ~/.config/TinyTriangle/config.txt",
        invalid_type_error: "Token must be a string",
      })
      .length(24, "Token must be exactly 24 characters long");

    RNFS.readFile(
      RNFS.DocumentDirectoryPath + "/../.config/TinyTriangle/config.txt",
      "utf8",
    )
      .then((token: string) => {
        tokenValidator.parse(token);
        this.token = token;
        AsyncStorage.setItem("vercelToken", token).then(() => this.sync());
      })
      .catch((err: any) => {
        console.log("Error", err);
      });
  }

  async getToken() {
    const token = await AsyncStorage.getItem("vercelToken");
    if (token !== this.token) {
      this.token = token || "";
      this.sync();
    }
  }
}
