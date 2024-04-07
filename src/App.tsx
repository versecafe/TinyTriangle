import * as React from 'react';

import {Platform, Linking, BackHandler, DevSettings} from 'react-native';
import {
  MenuBarExtraItem,
  MenuBarExtraSeparator,
  MenubarExtraView,
} from 'react-native-menubar-extra';
import {Vercel, type Organization, Account} from './vercel';

function MenuBar(): JSX.Element {
  const [organizations, setOrganizations] = React.useState<Organization[]>([]);
  const [account, setAccount] = React.useState<Account>({
    username: '',
    gitProvider: '',
  });
  const vercel = React.useMemo(
    () => new Vercel(setAccount, setOrganizations),
    [],
  );

  React.useEffect(() => {
    // Insert your Vercel Token Here
    vercel.setToken('');

    const intervalId = setInterval(() => {
      vercel.sync();
    }, 1200000); // 1200000 milliseconds = 20 minutes refresh data periodically

    return () => clearInterval(intervalId);
  }, [vercel]);

  return (
    <MenubarExtraView icon="triangle.fill">
      <MenuBarExtraItem
        title="Send Bug Report"
        icon="paperplane"
        keyEquivalent="1"
        keyEquivalentModifierMask="OPTION"
        onItemPress={() => {
          console.log('First item');
        }}>
        <MenuBarExtraItem
          title="GitHub Issues"
          onItemPress={() => {
            Linking.openURL(
              'https://github.com/versecafe/TinyTriangle/issues',
            ).catch(err => console.error('An error occurred', err));
          }}
        />
        <MenuBarExtraItem
          title="Email"
          onItemPress={() => {
            Linking.openURL(
              'mailto:ve.re.ca@protonmail.com?subject=Tiny Triangle Bug Report&body=',
            ).catch(err => console.error('An error occurred', err));
          }}
        />
      </MenuBarExtraItem>
      <MenuBarExtraSeparator />
      <MenuBarExtraItem
        title={account.username}
        icon="person.fill"
        keyEquivalent="1"
        keyEquivalentModifierMask="SHIFT"
        onItemPress={() => console.log('Account')}>
        <MenuBarExtraItem
          title="Change Token"
          onItemPress={async () => {
            await vercel.setToken('fdsfda');
          }}
        />
        <MenuBarExtraItem title="Sign out" />
      </MenuBarExtraItem>
      <MenuBarExtraItem
        title="Go to Dashboard"
        keyEquivalent="d"
        keyEquivalentModifierMask="SHIFT"
        onItemPress={() => {
          Linking.openURL('https://vercel.com').catch(err =>
            console.error('An error occurred', err),
          );
        }}
      />
      <MenuBarExtraSeparator />
      {organizations.map(organization => {
        return (
          <MenuBarExtraItem
            title={organization.name}
            key={organization.name}
            onItemPress={() => {
              console.log(organization.name);
              Linking.openURL(organization.url).catch(err =>
                console.error('An error occurred', err),
              );
            }}>
            {organization.projects.map(project => {
              return (
                <MenuBarExtraItem
                  title={project.name}
                  key={project.name}
                  onItemPress={() => {
                    Linking.openURL(
                      organization.url + '/' + project.name,
                    ).catch(err =>
                      console.error(
                        'An error occurred in linking to a project',
                        err,
                      ),
                    );
                  }}
                />
              );
            })}
            <MenuBarExtraSeparator />
            <MenuBarExtraItem
              title="Extensions"
              onItemPress={() =>
                Linking.openURL(organization.url + '/~/integrations').catch(
                  err => console.error('An error occurred', err),
                )
              }
            />
            <MenuBarExtraItem
              title="Settings"
              onItemPress={() =>
                Linking.openURL(organization.url + '/~/settings').catch(err =>
                  console.error('An error occurred', err),
                )
              }
            />
          </MenuBarExtraItem>
        );
      })}
      <MenuBarExtraSeparator />
      <MenuBarExtraItem
        title="Restart"
        icon="arrow.triangle.2.circlepath"
        keyEquivalentModifierMask="COMMAND"
        keyEquivalent="r"
        onItemPress={() => {
          console.log('Restart');
          DevSettings.reload();
        }}
      />
      <MenuBarExtraItem
        title="Quit"
        icon="power"
        keyEquivalentModifierMask="COMMAND"
        keyEquivalent="q"
        onItemPress={() => {
          console.log('Quit');
          BackHandler.exitApp();
        }}
      />
    </MenubarExtraView>
  );
}

export default function App() {
  return (
    <>
      {/* Display menu bar only on macOS */}
      {Platform.OS === 'macos' ? <MenuBar /> : null}
    </>
  );
}
