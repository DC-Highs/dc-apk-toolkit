import {
    LuLayoutDashboard,
    LuDownload,
    LuFolderOpen,
    LuSettings,
} from "react-icons/lu"
import { NavLink } from "react-router-dom"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "./ui/sidebar"

const items = [
    {
        title: "Dashboard",
        url: "/",
        icon: LuLayoutDashboard,
    },
    {
        title: "Downloader",
        url: "/downloader",
        icon: LuDownload,
    },
    {
        title: "Extracted Files",
        url: "/files",
        icon: LuFolderOpen,
    },
    {
        title: "Settings",
        url: "/settings",
        icon: LuSettings,
    },
]

export function ToolkitSidebar() {
    return (
        <Sidebar collapsible="icon">
            <SidebarHeader className="bg-sidebar">
                <div className="flex items-center gap-2 px-2 py-4">
                    <div className="bg-primary flex aspect-square size-8 items-center justify-center rounded-lg text-white">
                        <LuDownload className="size-5" />
                    </div>
                    <div className="flex flex-col gap-0.5 group-data-[collapsible=icon]:hidden">
                        <span className="font-semibold leading-none text-foreground">
                            DC Toolkit
                        </span>
                        <span className="text-muted-foreground text-xs uppercase tracking-widest font-bold">
                            v0.1.0
                        </span>
                    </div>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel className="uppercase tracking-widest text-xs font-bold opacity-50">
                        Menu
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        tooltip={item.title}
                                    >
                                        <NavLink
                                            to={item.url}
                                            className={({ isActive }) =>
                                                isActive
                                                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                                                    : ""
                                            }
                                        >
                                            <item.icon className="size-4" />
                                            <span>{item.title}</span>
                                        </NavLink>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <div className="p-4 group-data-[collapsible=icon]:hidden">
                    <div className="bg-muted flex flex-col items-center gap-2 rounded-lg p-4 text-center">
                        <span className="text-sm font-semibold">
                            Need Help?
                        </span>
                        <p className="text-muted-foreground text-[10px] uppercase leading-relaxed tracking-wider">
                            Check documentation or open an issue on GitHub.
                        </p>
                    </div>
                </div>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
