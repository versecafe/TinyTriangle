#import <RCTAppDelegate.h>
#import <Cocoa/Cocoa.h>

@interface AppDelegate : RCTAppDelegate

@property(nonatomic, strong) NSPopover *popover;
@property(nonatomic, strong) NSStatusItem *statusItem;
@property(nonatomic, strong) RCTPlatformView *rootView;

@end
