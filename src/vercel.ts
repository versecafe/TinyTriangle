import AsyncStorage from '@react-native-async-storage/async-storage';

export type Organization = {
  name: string;
  teamId: string;
  url: string;
  projects: {name: string}[];
};

export type Account = {
  username: string;
  gitProvider: string;
};

export class Vercel {
  user: Account = {username: '', gitProvider: ''};
  token: string = '';
  organizations: Organization[] = [];
  accountSetter: (account: Account) => void;
  orgSetter: (orgs: Organization[]) => void;
  constructor(
    accountSetter: (account: Account) => void,
    orgSetter: (orgs: Organization[]) => void,
  ) {
    console.log('Vercel');
    this.accountSetter = accountSetter;
    this.orgSetter = orgSetter;
  }
  async sync() {
    await this.getToken();
    const userData = await fetch('https://api.vercel.com/v2/user', {
      headers: {Authorization: `Bearer ${this.token}`},
    });
    const teamsData = await fetch('https://api.vercel.com/v2/teams', {
      headers: {Authorization: `Bearer ${this.token}`},
    });
    const teamsJson = await teamsData.json();
    const userJson = await userData.json();
    this.user = {
      username: userJson.user.username,
      gitProvider: userJson.user.importFlowGitProvider,
    };
    this.accountSetter(this.user);

    if (teamsJson.teams) {
      const tempOrgs: Organization[] = teamsJson.teams.map(
        (team: {id: string; name: string; slug: string}) => ({
          name: team.name,
          teamId: team.id,
          url: `https://vercel.com/${team.slug}`,
          projects: [],
        }),
      );

      (async () => {
        for (const org of tempOrgs) {
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
        console.log('tempOrgs', tempOrgs);
        this.organizations = tempOrgs;
        this.orgSetter(this.organizations);
      })();
    }
    this.orgSetter(this.organizations);
  }

  async setToken(token: string) {
    this.token = token;
    await AsyncStorage.setItem('vercelToken', token);
    this.sync();
  }

  async getToken() {
    const token = await AsyncStorage.getItem('vercelToken');
    if (token !== this.token) {
      this.token = token || '';
      this.sync();
    }
  }
}
