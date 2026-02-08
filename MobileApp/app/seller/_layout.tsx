import { Stack } from 'expo-router';
import { ImperialHeader } from '@/components/ImperialHeader';

export default function SellerLayout() {
    return (
        <Stack
            screenOptions={{
                header: () => <ImperialHeader showBanner={false} title="MERCHANT THRONE" subtitle="MANAGE YOUR EMPIRE" />
            }}>
            <Stack.Screen 
                name="dashboard" 
                options={{ 
                    headerShown: true
                }} 
            />
            <Stack.Screen 
                name="add-product" 
                options={{ 
                    headerShown: true
                }} 
            />
            <Stack.Screen 
                name="orders/[id]" 
                options={{ 
                    headerShown: true
                }} 
            />
        </Stack>
    );
}
