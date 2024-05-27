import * as React from 'react';

import {Platform, Linking, BackHandler, DevSettings} from 'react-native';
import {
  MenuBarExtraItem,
  MenuBarExtraSeparator,
  MenubarExtraView,
} from 'react-native-menubar-extra';
import {Vercel, type Organization, Account} from './vercel';
import {Settings, type ControlState} from './settings';

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

  // Project settings
  const [showAnalytics, setShowAnalytics] = React.useState<ControlState>('OFF');
  const [showProjectSettings, setShowProjectSettings] =
    React.useState<ControlState>('OFF');
  const [showLogs, setShowLogs] = React.useState<ControlState>('OFF');
  const [showDeployments, setShowDeployments] =
    React.useState<ControlState>('OFF');

  // Organization settings
  const [showIntegrations, setShowIntegrations] =
    React.useState<ControlState>('OFF');
  const [showUsage, setShowUsage] = React.useState<ControlState>('OFF');
  const [showOrganizationSettings, setShowOrganizationSettings] =
    React.useState<ControlState>('ON');

  const settings = React.useMemo(
    () =>
      new Settings({
        setShowAnalytics,
        setShowProjectSettings,
        setShowLogs,
        setShowDeployments,
        setShowIntegrations,
        setShowUsage,
        setShowOrganizationSettings,
      }),
    [
      setShowAnalytics,
      setShowProjectSettings,
      setShowLogs,
      setShowDeployments,
      setShowIntegrations,
      setShowUsage,
      setShowOrganizationSettings,
    ],
  );

  React.useEffect(() => {
    // Insert your Vercel Token Here
    vercel.setToken();
    // Apply stored settings to all setters
    settings.sync();

    const intervalId = setInterval(() => {
      vercel.sync();
    }, 300000); // 300000 milliseconds = 5 minutes refresh data periodically
    return () => clearInterval(intervalId);
  }, [vercel, settings]);

  return (
    <MenubarExtraView
      icon={
        organizations.some(organization => organization.unreadComments > 0)
          ? 'exclamationmark.triangle'
          : 'triangle.fill'
      }>
      <MenuBarExtraItem
        title="Send Bug Report"
        icon="paperplane"
        keyEquivalent="1"
        keyEquivalentModifierMask="OPTION"
        onItemPress={() => {}}>
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
        onItemPress={() => {}}>
        <MenuBarExtraItem
          title="Change Token"
          onItemPress={async () => {
            console.log('UI Not Implemented Yet');
          }}
        />
        <MenuBarExtraItem
          title="Account Settings"
          keyEquivalent="s"
          keyEquivalentModifierMask="SHIFT"
          onItemPress={() => {
            Linking.openURL('https://vercel.com/account').catch(err =>
              console.error('An error occurred', err),
            );
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
            icon={organization.unreadComments > 0 ? 'bell.badge' : ''}
            onItemPress={() => {
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
                  }}>
                  {showProjectSettings === 'ON' ? (
                    <MenuBarExtraItem
                      title="Settings"
                      onItemPress={() =>
                        Linking.openURL(
                          organization.url + '/' + project.name + '/settings',
                        ).catch(err => console.error('An error occurred', err))
                      }
                    />
                  ) : null}
                  {showAnalytics === 'ON' ? (
                    <MenuBarExtraItem
                      title="Analytics"
                      onItemPress={() =>
                        Linking.openURL(
                          organization.url + '/' + project.name + '/analytics',
                        ).catch(err => console.error('An error occurred', err))
                      }
                    />
                  ) : null}
                  {showLogs === 'ON' ? (
                    <MenuBarExtraItem
                      title="Logs"
                      onItemPress={() =>
                        Linking.openURL(
                          organization.url + '/' + project.name + '/logs',
                        ).catch(err => console.error('An error occurred', err))
                      }
                    />
                  ) : null}
                  {showDeployments === 'ON' ? (
                    <MenuBarExtraItem
                      title="Deployments"
                      onItemPress={() =>
                        Linking.openURL(
                          organization.url +
                            '/' +
                            project.name +
                            '/deployments',
                        ).catch(err => console.error('An error occurred', err))
                      }
                    />
                  ) : null}
                </MenuBarExtraItem>
              );
            })}
            <MenuBarExtraSeparator />
            {showIntegrations === 'ON' ? (
              <MenuBarExtraItem
                title="Integrations"
                onItemPress={() =>
                  Linking.openURL(organization.url + '/integrations').catch(
                    err => console.error('An error occurred', err),
                  )
                }
              />
            ) : null}
            {showUsage === 'ON' ? (
              <MenuBarExtraItem
                title="Usage"
                onItemPress={() =>
                  Linking.openURL(organization.url + '/usage').catch(err =>
                    console.error('An error occurred', err),
                  )
                }
              />
            ) : null}
            {showOrganizationSettings === 'ON' ? (
              <MenuBarExtraItem
                title="Settings"
                onItemPress={() =>
                  Linking.openURL(organization.url + '/settings').catch(err =>
                    console.error('An error occurred', err),
                  )
                }
              />
            ) : null}
          </MenuBarExtraItem>
        );
      })}
      <MenuBarExtraSeparator />
      <MenuBarExtraItem
        title="Settings"
        onItemPress={() => {}}
        icon="gearshape">
        <MenuBarExtraItem title="Projects" onItemPress={() => {}}>
          <MenuBarExtraItem
            title="Show Settings"
            controlState={showProjectSettings ?? 'OFF'}
            onItemPress={async () => {
              await settings.set(
                'setShowProjectSettings',
                showProjectSettings === 'OFF' ? 'ON' : 'OFF',
              );
            }}
          />
          <MenuBarExtraItem
            title="Show Analytics"
            controlState={showAnalytics ?? 'OFF'}
            onItemPress={async () => {
              await settings.set(
                'setShowAnalytics',
                showAnalytics === 'OFF' ? 'ON' : 'OFF',
              );
            }}
          />
          <MenuBarExtraItem
            title="Show Logs"
            controlState={showLogs ?? 'OFF'}
            onItemPress={async () => {
              await settings.set(
                'setShowLogs',
                showLogs === 'OFF' ? 'ON' : 'OFF',
              );
            }}
          />
          <MenuBarExtraItem
            title="Show Deployments"
            controlState={showDeployments ?? 'OFF'}
            onItemPress={async () => {
              await settings.set(
                'setShowDeployments',
                showDeployments === 'OFF' ? 'ON' : 'OFF',
              );
            }}
          />
        </MenuBarExtraItem>
        <MenuBarExtraItem title="Organizations" onItemPress={() => {}}>
          <MenuBarExtraItem
            title="Show Settings"
            controlState={showOrganizationSettings ?? 'OFF'}
            onItemPress={async () => {
              await settings.set(
                'setShowOrganizationSettings',
                showOrganizationSettings === 'OFF' ? 'ON' : 'OFF',
              );
            }}
          />
          <MenuBarExtraItem
            title="Show Usage"
            controlState={showUsage ?? 'OFF'}
            onItemPress={async () => {
              await settings.set(
                'setShowUsage',
                showUsage === 'OFF' ? 'ON' : 'OFF',
              );
            }}
          />
          <MenuBarExtraItem
            title="Show Integrations"
            controlState={showIntegrations ?? 'OFF'}
            onItemPress={async () => {
              await settings.set(
                'setShowIntegrations',
                showIntegrations === 'OFF' ? 'ON' : 'OFF',
              );
            }}
          />
        </MenuBarExtraItem>
      </MenuBarExtraItem>
      <MenuBarExtraItem
        title="Restart"
        icon="arrow.triangle.2.circlepath"
        keyEquivalentModifierMask="COMMAND"
        keyEquivalent="r"
        onItemPress={() => {
          if (process.env.NODE_ENV === 'development') {
            DevSettings.reload();
          } else {
            vercel.sync();
          }
        }}
      />
      <MenuBarExtraItem
        title="Quit"
        icon="power"
        keyEquivalentModifierMask="COMMAND"
        keyEquivalent="q"
        onItemPress={() => {
          // Currently, there is no way to exit the app on macOS
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
