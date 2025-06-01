import React, { useState, useEffect } from 'react';
import {
    Avatar, Box, Card, CardContent, Chip, Grid, List, ListItem,
    ListItemAvatar, ListItemText, Typography, IconButton, Paper, Skeleton
} from '@mui/material';
import { motion } from 'framer-motion';

// --- Import a wide range of icons ---
import {
    Share, Facebook, Twitter, FilterList, MoreHoriz, Code, Campaign,
    VolunteerActivism, StarBorder, EmojiEvents, WorkspacePremium
} from '@mui/icons-material';

// --- Helper to map string names from your data to actual Icon components ---
const iconMap = {
    Code: <Code />,
    Campaign: <Campaign />,
    VolunteerActivism: <VolunteerActivism />,
    StarBorder: <StarBorder color="primary" fontSize="large"/>,
    EmojiEvents: <EmojiEvents color="primary" fontSize="large"/>,
    WorkspacePremium: <WorkspacePremium color="primary" fontSize="large"/>,
    Default: <div />,
};

// --- Animation Variants ---
const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } },
};


// ===================================================================================
//
//  SKELETON LOADER COMPONENT
//  This component renders a placeholder UI while the data is loading.
//
// ===================================================================================
const DashboardSkeleton = () => (
    <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={3}>
            {/* --- Left Sidebar Skeleton --- */}
            <Grid item xs={12} md={3}>
                <Card sx={{ mb: 3 }}>
                    <CardContent>
                        <Skeleton variant="text" width="60%" sx={{ mb: 2 }} />
                        <List>
                            {[...Array(3)].map((_, index) => (
                                <ListItem key={index} disablePadding>
                                    <ListItemAvatar>
                                        <Skeleton variant="circular" width={40} height={40} />
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={<Skeleton variant="text" width="80%" />}
                                        secondary={<Skeleton variant="text" width="50%" />}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </CardContent>
                </Card>
                <Card sx={{ mb: 3 }}>
                    <CardContent>
                        <Skeleton variant="text" width="40%" sx={{ mb: 2 }} />
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            <Skeleton variant="rounded" width={60} height={32} />
                            <Skeleton variant="rounded" width={70} height={32} />
                            <Skeleton variant="rounded" width={50} height={32} />
                        </Box>
                    </CardContent>
                </Card>
            </Grid>

            {/* --- Main Content Skeleton --- */}
            <Grid item xs={12} md={6}>
                <Card sx={{ mb: 3 }}>
                     <Skeleton variant="rectangular" height={150} />
                     <CardContent>
                         <Skeleton variant="text" sx={{ fontSize: '2rem' }} width="40%"/>
                         <Skeleton variant="text" width="20%"/>
                     </CardContent>
                </Card>
                <Card>
                    <CardContent>
                        <Skeleton variant="text" width="50%" sx={{ mb: 2 }}/>
                         {[...Array(3)].map((_, index) => (
                                <ListItem key={index} divider>
                                    <ListItemAvatar>
                                        <Skeleton variant="circular" width={40} height={40} />
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={<Skeleton variant="text" width="70%" />}
                                        secondary={<Skeleton variant="text" width="30%" />}
                                    />
                                    <Skeleton variant="rounded" width={90} height={24} />
                                </ListItem>
                            ))}
                    </CardContent>
                </Card>
            </Grid>

            {/* --- Right Sidebar Skeleton --- */}
            <Grid item xs={12} md={3}>
                <Card sx={{ mb: 3 }}>
                    <CardContent>
                        <Skeleton variant="text" width="50%" sx={{ mb: 2 }}/>
                        {[...Array(2)].map((_, index) => (
                             <ListItem key={index}>
                                <ListItemAvatar>
                                    <Skeleton variant="circular" width={40} height={40} />
                                </ListItemAvatar>
                                <ListItemText
                                    primary={<Skeleton variant="text" width="80%" />}
                                    secondary={<Skeleton variant="text" width="50%" />}
                                />
                            </ListItem>
                        ))}
                    </CardContent>
                </Card>
                <Card>
                    <CardContent>
                         <Skeleton variant="text" width="60%" sx={{ mb: 2 }}/>
                         <Box sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', pt: 2 }}>
                             <Skeleton variant="circular" width={48} height={48} />
                             <Skeleton variant="circular" width={48} height={48} />
                             <Skeleton variant="circular" width={48} height={48} />
                         </Box>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    </Box>
);


// ===================================================================================
//
//  MAIN DASHBOARD STUDENT COMPONENT
//  This component handles data fetching and displays the final UI.
//
// ===================================================================================
const DashboardStudent = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // --- Simulate a network request ---
        const timer = setTimeout(() => {
            // This is the mock data structure.
            // In a real app, you would get this from your API call.
            const fetchedData = {
                user: { name: 'Aymen Bida', role: 'Club Member', avatarUrl: 'https://i.pravatar.cc/150?u=aymenbida', coverImageUrl: 'https://picsum.photos/id/1018/800/200' },
                messages: [
                    { id: 1, author: 'Jane Smith', text: 'Meeting reminder for tomorrow!', time: '1h ago', avatarUrl: 'https://i.pravatar.cc/150?u=janesmith' },
                    { id: 2, author: 'Club President', text: 'New event budget approved.', time: '3h ago', avatarUrl: 'https://i.pravatar.cc/150?u=president' },
                ],
                clubTags: ['Tech', 'Debate', 'Community', 'Events', 'Design'],
                interests: [
                    { id: 1, name: 'Programming', icon: 'Code' },
                    { id: 2, name: 'Public Speaking', icon: 'Campaign' },
                    { id: 3, name: 'Volunteering', icon: 'VolunteerActivism' },
                ],
                upcomingEvents: [
                    { id: 1, title: 'Annual Tech Symposium', date: 'In 3 Days', status: 'Confirmed' },
                    { id: 2, title: 'Community Bake Sale', date: 'In 1 Week', status: 'Planning' },
                    { id: 3, title: 'End of Year Club Dinner', date: 'In 2 Weeks', status: 'Confirmed' },
                ],
                clubAdmins: [
                    { id: 1, name: 'Jane Smith', role: 'President', avatarUrl: 'https://i.pravatar.cc/150?u=janesmith' },
                    { id: 2, name: 'Peter Jones', role: 'Treasurer', avatarUrl: 'https://i.pravatar.cc/150?u=peterjones' },
                ],
                activityFeed: [
                    { id: 1, text: 'You joined the "Annual Tech Symposium" event.' },
                    { id: 2, text: 'A new announcement was posted by the Club President.' },
                ],
                badges: [
                    { id: 1, name: 'Initiate', icon: 'StarBorder' },
                    { id: 2, name: 'Organizer', icon: 'EmojiEvents' },
                    { id: 3, name: 'Contributor', icon: 'WorkspacePremium' },
                ]
            };

            setDashboardData(fetchedData);
            setLoading(false);
        }, 2000); // Simulate a 2-second loading time

        // Cleanup function to clear the timer
        return () => clearTimeout(timer);
    }, []); // Empty dependency array means this runs once on mount


    // --- Render Skeleton while loading ---
    if (loading) {
        return <DashboardSkeleton />;
    }

    // --- Render the actual dashboard once data is loaded ---
    const {
        user, messages, clubTags, interests,
        upcomingEvents, clubAdmins, activityFeed, badges
    } = dashboardData;

    return (
        <Box sx={{ flexGrow: 1 }}>
            <motion.div variants={containerVariants} initial="hidden" animate="visible">
                <Grid container spacing={3}>
                    {/* --- Left Sidebar --- */}
                    <Grid item xs={12} md={3}>
                        <motion.div variants={itemVariants}>
                            <Card sx={{ mb: 3 }}>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>Recent Messages</Typography>
                                    <List>
                                        {messages.map((msg) => (
                                            <ListItem key={msg.id} disablePadding>
                                                <ListItemAvatar><Avatar alt={msg.author} src={msg.avatarUrl} /></ListItemAvatar>
                                                <ListItemText primary={msg.author} secondary={msg.text} />
                                            </ListItem>
                                        ))}
                                    </List>
                                </CardContent>
                            </Card>
                        </motion.div>
                        <motion.div variants={itemVariants}>
                            <Card sx={{ mb: 3 }}>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>Club Tags</Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                        {clubTags.map((tag) => <Chip key={tag} label={tag} />)}
                                    </Box>
                                </CardContent>
                            </Card>
                        </motion.div>
                         <motion.div variants={itemVariants}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>Your Interests</Typography>
                                    <List>
                                        {interests.map((interest) => (
                                            <ListItem key={interest.id} disablePadding>
                                                <ListItemAvatar>{iconMap[interest.icon] || iconMap.Default}</ListItemAvatar>
                                                <ListItemText primary={interest.name} />
                                            </ListItem>
                                        ))}
                                    </List>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </Grid>

                    {/* --- Main Content --- */}
                    <Grid item xs={12} md={6}>
                        <motion.div variants={itemVariants}>
                             <Card sx={{ position: 'relative', height: '250px', mb: 3 }}>
                                <Box component="img" sx={{ height: '150px', width: '100%', objectFit: 'cover' }} src={user.coverImageUrl} alt="Cover Image"/>
                                <Avatar alt={user.name} src={user.avatarUrl} sx={{ width: 80, height: 80, position: 'absolute', top: '110px', left: '20px', border: '4px solid white' }}/>
                                <Box sx={{ p: 2, pt: 6 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Box><Typography variant="h5">{user.name}</Typography><Typography variant="body2" color="text.secondary">{user.role}</Typography></Box>
                                        <Box><IconButton><Share /></IconButton><IconButton><Facebook /></IconButton><IconButton><Twitter /></IconButton></Box>
                                    </Box>
                                </Box>
                            </Card>
                        </motion.div>
                        <motion.div variants={itemVariants}>
                            <Card>
                                <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}><Typography variant="h6">Upcoming Events</Typography><IconButton><FilterList /></IconButton></Box>
                                    <List>
                                        {upcomingEvents.map((event) => (
                                            <ListItem key={event.id} divider>
                                                <ListItemAvatar><Avatar>{event.title.charAt(0)}</Avatar></ListItemAvatar>
                                                <ListItemText primary={event.title} secondary={`Due ${event.date}`} />
                                                <Chip label={event.status} color={event.status === 'Confirmed' ? 'success' : 'warning'} size="small" />
                                            </ListItem>
                                        ))}
                                    </List>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </Grid>

                    {/* --- Right Sidebar --- */}
                    <Grid item xs={12} md={3}>
                        <motion.div variants={itemVariants}>
                             <Card sx={{ mb: 3 }}>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>Club Admins</Typography>
                                    <List>
                                        {clubAdmins.map((admin) => (
                                            <ListItem key={admin.id} secondaryAction={<IconButton edge="end"><MoreHoriz /></IconButton>}>
                                                <ListItemAvatar><Avatar alt={admin.name} src={admin.avatarUrl} /></ListItemAvatar>
                                                <ListItemText primary={admin.name} secondary={admin.role} />
                                            </ListItem>
                                        ))}
                                    </List>
                                </CardContent>
                            </Card>
                        </motion.div>
                         <motion.div variants={itemVariants}>
                            <Card sx={{ mb: 3 }}>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>Badges Earned</Typography>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', pt: 2 }}>
                                         {badges.map(badge => (
                                            <Box key={badge.id} sx={{ textAlign: 'center' }}>{iconMap[badge.icon] || iconMap.Default}<Typography variant="caption" display="block">{badge.name}</Typography></Box>
                                        ))}
                                    </Box>
                                </CardContent>
                            </Card>
                        </motion.div>
                         <motion.div variants={itemVariants}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>Recent Activity</Typography>
                                    {activityFeed.map((activity) => (
                                       <Paper key={activity.id} elevation={0} sx={{ p: 1, mb: 1, display: 'flex', alignItems: 'center', backgroundColor: 'transparent' }}>
                                            <Typography variant="body2">{activity.text}</Typography>
                                       </Paper>
                                    ))}
                                </CardContent>
                            </Card>
                        </motion.div>
                    </Grid>
                </Grid>
            </motion.div>
        </Box>
    );
};

export default DashboardStudent;