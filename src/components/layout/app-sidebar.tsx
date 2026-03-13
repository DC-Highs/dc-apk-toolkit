import {
    LuLayoutDashboard,
    LuDownload,
    LuGift,
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
    SidebarFooter,
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
        title: "System Releases",
        icon: LuGift,
        path: "/releases",
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
                                    <span className="text-[10px] text-muted-foreground opacity-60">Powered by DC Highs</span>
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
            <SidebarFooter className="p-4 border-t border-sidebar-border/50">
                 <div className="flex items-center justify-between opacity-40 hover:opacity-100 transition-opacity">
                    <span className="text-[10px] font-mono tracking-tighter uppercase">Framework Node</span>
                    <Badge variant="outline" className="text-[9px] h-4 px-1.5 font-bold">v{packageJson.version}</Badge>
                 </div>
            </SidebarFooter>
        </Sidebar>
    )
}
