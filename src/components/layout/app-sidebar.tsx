import {
    LuLayoutDashboard,
    LuDownload,
    LuFolderOpen,
    LuSettings,
    LuZap,
    LuChevronRight,
    LuImage,
    LuMusic,
} from "react-icons/lu"
import { Link, useLocation, useNavigate } from "react-router-dom"

import packageJson from "@package.json"
import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
} from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"

const menuItems = [
    {
        title: "Overview",
        icon: LuLayoutDashboard,
        path: "/",
    },
    {
        title: "Acquisition",
        icon: LuDownload,
        path: "/downloader",
    },
    {
        title: "Asset Explorer",
        icon: LuFolderOpen,
        path: "/files",
    },
    {
        title: "Image Gallery",
        icon: LuImage,
        path: "/images",
    },
    {
        title: "Audio Library",
        icon: LuMusic,
        path: "/audio",
    },
    {
        title: "Settings",
        icon: LuSettings,
        path: "/settings",
    },
]

export function AppSidebar() {
    const location = useLocation()
    const navigate = useNavigate()

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link to="/">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                    <LuZap className="size-4" />
                                </div>
                                <div className="flex flex-col gap-0.5 leading-none">
                                    <span className="font-medium">DC APK Toolkit</span>
                                    <Badge className="text-xs" variant="outline">v{packageJson.version}</Badge>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>
                        Binary Pipeline
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {menuItems.map((item) => {
                                const isActive = location.pathname === item.path

                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            asChild
                                            isActive={isActive}
                                            tooltip={item.title}
                                            className="h-9 px-3"
                                        >
                                            <button onClick={() => navigate(item.path)} className="flex items-center gap-3 w-full">
                                                <item.icon className="size-4" />
                                                <span className="text-sm font-medium">{item.title}</span>
                                                {isActive && <LuChevronRight className="ml-auto size-3 opacity-50" />}
                                            </button>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}
