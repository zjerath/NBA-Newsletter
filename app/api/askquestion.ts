import type { NextApiRequest, NextApiResponse } from 'next'
import query from '../../lib/queryapi'
import admin from 'firebase-admin'
import { adminDb } from '../../firebaseadmin'
import { resolve } from 'path';
const { exec } = require('child_process');

type Data = {
    answer: string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    var {prompt, chatId, model, session } = req.body
    console.log(prompt);
    if (!prompt) {
        res.status(400).json({ answer: 'Please provide a prompt!' })
        return
    }
    if (!chatId) {
        res.status(400).json({ answer: 'Please provide a valid chat ID!' })
        return
    }
    // ChatGPT Query
    var pattern = /^[0-9\/]+$/;

    if (prompt.toLowerCase().includes("analyze my bets")) {
        
        let lines = prompt.split('\n');

        // filter out empty lines
        lines = lines.filter((line: string) => line.trim() !== '');

        // get the bet details line
        let betDetailsLine = lines[1]; // this assumes that bet details are always on the second line

        // split bet details by comma
        let betDetails = betDetailsLine.split(',');

        // trim any leading or trailing whitespace from each detail
        betDetails = betDetails.map((detail:string) => detail.trim());

        console.log(betDetails);
        betDetails = betDetails.map((detail: string) => detail.trim());

        // get the individual components
        let player = betDetails[0];
        let team = betDetails[1];
        let stat = betDetails[2];
        let betType = betDetails[3];

        console.log(player);  // Output: 'Kevin Durant'
        console.log(team);    // Output: 'Phoenix'
        console.log(stat);    // Output: 'Assists'
        console.log(betType); // Output: 'Over'
        const path = require('path');

// save the original working directory
        const originalDirectory = process.cwd();

        const pythonScriptPath = path.join(__dirname, '../../../../python_files/main.py');
        // get the directory of the python script
        const pythonScriptDir = path.dirname(pythonScriptPath);

        let promise = new Promise((resolve, reject) => {
            // change the current working directory to the directory of the python script
            process.chdir(pythonScriptDir);

            exec(`python3 "${path.basename(pythonScriptPath)}" "${player}" ${team} ${stat} ${betType}`, (error: Error | null, stdout: string, stderr: string) => {
                // change the working directory back to the original
                process.chdir(originalDirectory);

                if (error) {
                    console.error(`Error executing the Python script: ${error}`);
                    reject(error);
                } else {
                    console.log('Python script executed successfully!');
                    console.log('Output:', stdout);
                    resolve(stdout);
                }
            });
        });

        try {
            prompt = await promise;
            console.log('Result:', prompt);
        } catch (error) {
            console.error('Error:', error);
            // change the working directory back to the original in case of an error
        }
        process.chdir(originalDirectory);

        console.log(prompt)
        const response = await query(prompt, chatId, model, session)
        const message: Message = {
            text: response || 'NBANewsletter was unable to find an answer for that!',
            createdAt: admin.firestore.Timestamp.now(),
            user: {
                _id: 'NBANewsletter',
                name: 'NBANewsletter',
                avatar: 'data:image/png;base64,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'
            },
        }
        await adminDb.collection('users').doc(session?.user?.email).collection('chats').doc(chatId).collection('messages').add(message)
        res.status(200).json( { answer: message.text })}
    
    else if (pattern.test(prompt)) {
        const message: Message = {
            text: 'Thank you!',
            createdAt: admin.firestore.Timestamp.now(),
            user: {
                _id: 'NBANewsletter',
                name: 'NBANewsletter',
                avatar: 'data:image/png;base64,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'
            },
        }
        await adminDb.collection('users').doc(session?.user?.email).collection('chats').doc(chatId).collection('messages').add(message)
        res.status(200).json( { answer: message.text })
    }
    
    else {
        const response = await query(prompt, chatId, model, session)
        const message: Message = {
            text: response || 'NBANewsletter was unable to find an answer for that!',
            createdAt: admin.firestore.Timestamp.now(),
            user: {
                _id: 'NBANewsletter',
                name: 'NBANewsletter',
                avatar: 'data:image/png;base64,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'
            },
        }
        await adminDb.collection('users').doc(session?.user?.email).collection('chats').doc(chatId).collection('messages').add(message)
        res.status(200).json( { answer: message.text })
    }
    
}